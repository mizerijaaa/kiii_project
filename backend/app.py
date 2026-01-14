from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_NAME', 'postgres'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', ''),
        port=os.getenv('DB_PORT', '5432')
    )
    return conn

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'book-library-api'})

@app.route('/api/books', methods=['GET'])
def get_books():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM books ORDER BY created_at DESC')
        books = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(books)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/search', methods=['GET'])
def search_books():
    query = request.args.get('q', '')
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        search_pattern = f'%{query}%'
        cur.execute(
            'SELECT * FROM books WHERE title ILIKE %s OR author ILIKE %s ORDER BY created_at DESC',
            (search_pattern, search_pattern)
        )
        books = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(books)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.get_json()

    if not data.get('title') or not data.get('author'):
        return jsonify({'error': 'Title and author are required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            '''INSERT INTO books (title, author, description, publication_year, isbn)
               VALUES (%s, %s, %s, %s, %s) RETURNING *''',
            (data['title'], data['author'], data.get('description', ''),
             data.get('publication_year'), data.get('isbn'))
        )
        new_book = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return jsonify(new_book), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            '''UPDATE books
               SET title = %s, author = %s, description = %s,
                   publication_year = %s, isbn = %s, updated_at = %s
               WHERE id = %s RETURNING *''',
            (data['title'], data['author'], data.get('description', ''),
             data.get('publication_year'), data.get('isbn'), datetime.now(), book_id)
        )
        updated_book = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if updated_book:
            return jsonify(updated_book)
        else:
            return jsonify({'error': 'Book not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM books WHERE id = %s', (book_id,))
        conn.commit()
        deleted_count = cur.rowcount
        cur.close()
        conn.close()

        if deleted_count > 0:
            return jsonify({'message': 'Book deleted successfully'})
        else:
            return jsonify({'error': 'Book not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
