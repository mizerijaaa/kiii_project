import { useState, useEffect } from 'react';
import { Book, BookFormData } from './types/Book';
import { bookService } from './services/api';
import { BookCard } from './components/BookCard';
import { AddBookForm } from './components/AddBookForm';
import { SearchBar } from './components/SearchBar';
import { Library, Plus } from 'lucide-react';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await bookService.searchBooks(searchQuery);
      setBooks(data);
    } catch (err) {
      setError('Failed to search books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      await bookService.addBook(bookData);
      setShowAddForm(false);
      loadBooks();
    } catch (err) {
      setError('Failed to add book');
      console.error(err);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookService.deleteBook(id);
      loadBooks();
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Library className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Book Library</h1>
          </div>

          <div className="flex flex-col items-center gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />

            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add New Book
              </button>
            )}
          </div>
        </header>

        {showAddForm && (
          <AddBookForm
            onSubmit={handleAddBook}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              {searchQuery ? 'No books found matching your search' : 'No books in the library yet'}
            </p>
            <p className="text-gray-500 mt-2">
              {!searchQuery && 'Add your first book to get started!'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found {books.length} book{books.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} onDelete={handleDeleteBook} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
