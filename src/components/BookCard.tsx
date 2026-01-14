import { Book } from '../types/Book';
import { Trash2, Book as BookIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onDelete }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(book.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Delete book"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {book.description && (
        <p className="text-gray-700 mb-3 line-clamp-3">{book.description}</p>
      )}

      <div className="flex gap-4 text-sm text-gray-500">
        {book.publication_year && (
          <span>Year: {book.publication_year}</span>
        )}
        {book.isbn && (
          <span>ISBN: {book.isbn}</span>
        )}
      </div>
    </div>
  );
}
