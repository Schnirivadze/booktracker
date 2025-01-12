package dev.andriiseleznov.java_book_tracker_backend.Book;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.andriiseleznov.java_book_tracker_backend.User.User;
import dev.andriiseleznov.java_book_tracker_backend.User.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    public BookController(BookService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/search")
    public List<Book> searchBooks(@RequestBody SearchRequest searchRequest) {
        String keyword = searchRequest.getKeyword();
        int shelfGroupIndex = searchRequest.getShelfGroupIndex();

        Optional<User> userOptional = userService.authenticate(searchRequest.getLogin(), searchRequest.getPassword());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Unauthorized: Invalid credentials");
        }

        User user = userOptional.get();
        List<Long> shelfGroupIds = user.getShelfGroupIds();
        if (shelfGroupIds.isEmpty() || shelfGroupIndex < 0 || shelfGroupIndex >= shelfGroupIds.size()) {
            throw new RuntimeException("Invalid shelf group index");
        }

        Long shelfGroupId = shelfGroupIds.get(shelfGroupIndex);

        return bookService.searchBooks(keyword, shelfGroupId);
    }

    @GetMapping("/shelf/{shelfId}")
    public List<Book> getBooksByShelfId(@PathVariable Long shelfId) {
        return bookService.getBooksByShelfId(shelfId);
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}