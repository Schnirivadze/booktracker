package dev.andriiseleznov.java_book_tracker_backend.Book;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public List<Book> getBooksByShelfId(Long shelfId) {
        return bookRepository.findByShelfId(shelfId);
    }

    public List<Book> getBooksByTag(String tag) {
        return bookRepository.findByTagsContaining(tag);
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword);
    }

    public Book updateBook(Long id, Book updatedBook) {
        return bookRepository.findById(id)
                .map(existingBook -> {
                    existingBook.setTitle(updatedBook.getTitle());
                    existingBook.setAuthor(updatedBook.getAuthor());
                    existingBook.setDescription(updatedBook.getDescription());
                    existingBook.setTags(updatedBook.getTags());
                    existingBook.setX(updatedBook.getX());
                    existingBook.setY(updatedBook.getY());
                    existingBook.setShelfId(updatedBook.getShelfId());
                    return bookRepository.save(existingBook);
                })
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
