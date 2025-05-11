const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

class Book {
  static async findAll() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data).books;
    } catch (error) {
      throw new Error('Failed to read books');
    }
  }

  static async saveAll(books) {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify({ books }, null, 2));
    } catch (error) {
      throw new Error('Failed to save books');
    }
  }

  static async findById(id) {
    const books = await this.findAll();
    return books.find(book => book.id === id);
  }

  static async create(newBook) {
    const books = await this.findAll();
    const id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    const book = { 
      id,
      status: 'available',
      ...newBook
    };
    books.push(book);
    await this.saveAll(books);
    return book;
  }

  static async update(id, updatedBook) {
    const books = await this.findAll();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { 
        ...books[index], 
        ...updatedBook,
        updatedAt: new Date().toISOString() 
      };
      await this.saveAll(books);
      return books[index];
    }
    return null;
  }

  static async delete(id) {
    const books = await this.findAll();
    const filteredBooks = books.filter(b => b.id !== id);
    if (filteredBooks.length !== books.length) {
      await this.saveAll(filteredBooks);
      return true;
    }
    return false;
  }

  static async borrow(id, readerName) {
    const books = await this.findAll();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1 && books[index].status === 'available') {
      books[index].status = 'borrowed';
      books[index].borrowedBy = readerName;
      books[index].borrowedDate = new Date().toISOString();
      await this.saveAll(books);
      return books[index];
    }
    return null;
  }

  static async return(id) {
    const books = await this.findAll();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1 && books[index].status === 'borrowed') {
      const borrowedDate = new Date(books[index].borrowedDate);
      const currentDate = new Date();
      const daysDiff = (currentDate - borrowedDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 3) {
        throw new Error('Book cannot be returned within 3 days of borrowing');
      }

      books[index].status = 'available';
      books[index].borrowedBy = null;
      books[index].borrowedDate = null;
      books[index].returnedDate = new Date().toISOString();
      await this.saveAll(books);
      return books[index];
    }
    return null;
  }

  static async getAvailableBooks() {
    const books = await this.findAll();
    return books.filter(book => book.status === 'available');
  }
}

module.exports = Book;