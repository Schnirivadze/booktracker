package dev.andriiseleznov.java_book_tracker_backend.Book;

import dev.andriiseleznov.java_book_tracker_backend.User.User;
import dev.andriiseleznov.java_book_tracker_backend.User.UserService;
import dev.andriiseleznov.java_book_tracker_backend.Util.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public BookController(BookService bookService, UserService userService, JwtUtil jwtUtil) {
        this.bookService = bookService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/shelf/{shelfId}")
    public List<Book> getBooksByShelfId(@PathVariable Long shelfId) {
        return bookService.getBooksByShelfId(shelfId);
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestHeader("Authorization") String token, @RequestParam String keyword, @RequestParam int shelfGroupIndex) {
        String username = jwtUtil.extractUsername(token);
        if (username == null) {
            throw new RuntimeException("Unauthorized: Invalid token");
        }

        Optional<User> userOptional = userService.getUserByLogin(username);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Unauthorized: Invalid token");
        }

        User user = userOptional.get();
        List<Long> shelfGroupIds = user.getShelfGroupIds();
        if (shelfGroupIds.isEmpty() || shelfGroupIndex < 0 || shelfGroupIndex >= shelfGroupIds.size()) {
            throw new RuntimeException("Invalid shelf group index");
        }

        Long shelfGroupId = shelfGroupIds.get(shelfGroupIndex);

        return bookService.searchBooks(keyword, shelfGroupId);
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
