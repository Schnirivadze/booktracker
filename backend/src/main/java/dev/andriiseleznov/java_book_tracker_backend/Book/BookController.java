package dev.andriiseleznov.java_book_tracker_backend.Book;

import dev.andriiseleznov.java_book_tracker_backend.Util.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final JwtUtil jwtUtil;

    public BookController(BookService bookService, JwtUtil jwtUtil) {
        this.bookService = bookService;
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
    public List<Book> searchBooks(@RequestHeader("Authorization") String token, @RequestParam String keyword, @RequestParam Long shelfId) {

		String login = jwtUtil.extractUsername(token.replace("Bearer ", ""));
		if (login == null) {
			
            throw new RuntimeException("Unauthorized: Invalid token");
		}

        return bookService.searchBooks(keyword, shelfId);
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
