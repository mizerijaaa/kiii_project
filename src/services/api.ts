import { Book, BookFormData } from '../types/Book';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const bookService = {
  async getAllBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  },

  async searchBooks(query: string): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search books');
    return response.json();
  },

  async addBook(bookData: BookFormData): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bookData,
        publication_year: bookData.publication_year ? parseInt(bookData.publication_year) : null,
      }),
    });
    if (!response.ok) throw new Error('Failed to add book');
    return response.json();
  },

  async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
  },
};
