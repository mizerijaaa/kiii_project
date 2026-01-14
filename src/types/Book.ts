export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  publication_year: number | null;
  isbn: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  publication_year: string;
  isbn: string;
}
