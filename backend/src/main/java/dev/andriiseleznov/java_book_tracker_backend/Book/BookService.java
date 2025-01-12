package dev.andriiseleznov.java_book_tracker_backend.Book;

import org.springframework.stereotype.Service;

import dev.andriiseleznov.java_book_tracker_backend.User.User;
import dev.andriiseleznov.java_book_tracker_backend.User.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserService userService;

    public BookService(BookRepository bookRepository, UserService userService) {
        this.bookRepository = bookRepository;
        this.userService = userService;
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

    public List<Book> searchBooks(String keyword, Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            List<Long> userShelfGroupIds = user.get().getShelfGroupIds();
            if (userShelfGroupIds.isEmpty()) {
                return List.of();
            }

            Long userShelfGroupId = userShelfGroupIds.get(0);
            return bookRepository.searchBooksByShelfGroup(keyword, userShelfGroupId);
        } else {
            throw new RuntimeException("User not found");
        }
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
