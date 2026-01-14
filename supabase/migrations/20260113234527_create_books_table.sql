/*
  # Create books table for library application

  1. New Tables
    - `books`
      - `id` (uuid, primary key) - Unique identifier for each book
      - `title` (text, not null) - Book title
      - `author` (text, not null) - Book author
      - `description` (text) - Book description
      - `publication_year` (integer) - Year the book was published
      - `isbn` (text, unique) - ISBN number
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `books` table
    - Add policy for public read access (anyone can view books)
    - Add policy for public insert access (anyone can add books)
    - Add policy for public update access (anyone can update books)
    - Add policy for public delete access (anyone can delete books)

  3. Indexes
    - Create index on title for faster search
    - Create index on author for faster search
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text DEFAULT '',
  publication_year integer,
  isbn text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view books"
  ON books
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add books"
  ON books
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update books"
  ON books
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete books"
  ON books
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS books_title_idx ON books(title);
CREATE INDEX IF NOT EXISTS books_author_idx ON books(author);