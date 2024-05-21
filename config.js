/** Common config for bookstore. */


let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql://noah:password@localhost/books_test"
} else {
    DB_URI = "postgresql://noah:password@localhost/books"    
}


module.exports = { DB_URI };