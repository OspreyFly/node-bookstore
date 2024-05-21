const request = require('supertest');
const app = require('./app'); // Assuming your Express app is exported from app.js
const db = require('./db');

process.env.NODE_ENV = "test";

beforeEach(async () => {
  try {
    await db.query(`
      INSERT INTO books_test (isbn, amazon_url, author, language, pages, publisher, title, year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8),
             ($9, $10, $11, $12, $13, $14, $15, $16),
             ($17, $18, $19, $20, $21, $22, $23, $24);
    `, [
      '978-3-16-148410-0', 'https://www.amazon.com/dp/316148410X', 'John Doe', 'English', 256,
      'Example Publisher', 'A Great Book', 2020,
      '978-3-16-148411-7', 'https://www.amazon.com/dp/3161484111', 'Jane Smith', 'Spanish', 300,
      'Example Publisher', 'Another Great Book', 2021,
      '978-3-16-148412-4', 'https://www.amazon.com/dp/3161484124', 'Alice Johnson', 'French', 350,
      'Example Publisher', 'Yet Another Great Book', 2022
    ]);
  } catch (error) {
    console.error('Error inserting initial data:', error);
  }
});

describe('GET /', () => {
  it('responds with JSON array of books', async () => {
    const res = await request(app)
     .get('/')
     .expect('Content-Type', /json/)
     .expect(200);
    console.log(res);
    expect(res.body.books).toBeInstanceOf(Array);
  });
});

describe('GET /:id', () => {
  it('responds with JSON object representing a single book', async () => {
    const id = '1'; 
    const res = await request(app)
     .get(`/${id}`)
     .expect('Content-Type', /json/)
     .expect(200);

    expect(res.body.book).toHaveProperty('title');
  });
});

describe('POST /', () => {
  it('creates a new book and responds with status 201 and JSON representation of the new book', async () => {
    const bookData = {
      title: 'New Book',
      author: 'Author Name',
      isbn: '1234567890'
    };

    const res = await request(app)
     .post('/')
     .send(bookData)
     .expect('Content-Type', /json/)
     .expect(201);

    expect(res.body.book).toEqual(expect.objectContaining(bookData));
  });
});

describe('PUT /:isbn', () => {
  it('updates an existing book and responds with JSON representation of the updated book', async () => {
    const isbn = '1234567890';
    const updateData = {
      title: 'Updated Title'
    };

    const res = await request(app)
     .put(`/${isbn}`)
     .send(updateData)
     .expect('Content-Type', /json/)
     .expect(200);

    expect(res.body.book.title).toEqual(updateData.title);
  });
});

describe('DELETE /:isbn', () => {
  it('deletes a book and responds with JSON message indicating deletion', async () => {
    const isbn = '1234567890';

    const res = await request(app)
     .delete(`/${isbn}`)
     .expect('Content-Type', /json/)
     .expect(200);

    expect(res.body.message).toEqual('Book deleted');
  });
});
