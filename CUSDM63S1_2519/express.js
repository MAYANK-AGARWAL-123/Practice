const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ books: [] }, null, 2));
}

const readBooks = () => {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data).books;
};

const writeBooks = (books) => {
  fs.writeFileSync(DB_PATH, JSON.stringify({ books }, null, 2));
};

app.post('/books', (req, res) => {
  try {
    const books = readBooks();
    const newBook = {
      id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
      title: req.body.title,
      author: req.body.author,
      year: req.body.year
    };

    if (!newBook.title || !newBook.author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    books.push(newBook);
    writeBooks(books);
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/books', (req, res) => {
  try {
    const books = readBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/books/:id', (req, res) => {
  try {
    const books = readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/books/:id', (req, res) => {
  try {
    const books = readBooks();
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index !== -1) {
      const updatedBook = { ...books[index], ...req.body };
      books[index] = updatedBook;
      writeBooks(books);
      res.status(200).json(updatedBook);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/books/:id', (req, res) => {
  try {
    const books = readBooks();
    const filteredBooks = books.filter(b => b.id !== parseInt(req.params.id));
    if (filteredBooks.length < books.length) {
      writeBooks(filteredBooks);
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/books/search', (req, res) => {
  try {
    const authorQuery = req.query.author?.toLowerCase();
    const titleQuery = req.query.title?.toLowerCase();
    
    if (!authorQuery && !titleQuery) {
      return res.status(400).json({ 
        error: "At least one search parameter (author or title) is required" 
      });
    }

    const books = readBooks();
    let matchedBooks = books;

    if (authorQuery) {
      matchedBooks = matchedBooks.filter(b => 
        b.author.toLowerCase().includes(authorQuery)
      );
    }

    if (titleQuery) {
      matchedBooks = matchedBooks.filter(b => 
        b.title.toLowerCase().includes(titleQuery)
      );
    }

    if (matchedBooks.length > 0) {
      res.status(200).json(matchedBooks);
    } else {
      res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('POST /books - Add new book');
  console.log('GET /books - Get all books');
  console.log('GET /books/:id - Get book by ID');
  console.log('PUT /books/:id - Update book by ID');
  console.log('DELETE /books/:id - Delete book by ID');
  console.log('GET /books/search?author=<name> - Search books by author');
  console.log('GET /books/search?title=<name> - Search books by title');
  console.log('GET /books/search?author=<name>&title=<name> - Combined search');
});