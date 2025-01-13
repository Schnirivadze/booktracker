package dev.andriiseleznov.java_book_tracker_backend.Shelf;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shelves")
public class ShelfController {

    private final ShelfService shelfService;

    public ShelfController(ShelfService shelfService) {
        this.shelfService = shelfService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelf> getShelfById(@PathVariable Long id) {
        return shelfService.getShelfById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shelf> createShelf(@RequestBody Shelf shelf) {
        return ResponseEntity.ok(shelfService.createShelf(shelf));
    }

    @PutMapping("/{shelfId}/books/{bookId}")
    public ResponseEntity<String> addBookToShelf(@PathVariable Long shelfId, @PathVariable Long bookId) {
        shelfService.addBookToShelf(shelfId, bookId);
        return ResponseEntity.ok("Book added to shelf successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shelf> updateShelf(@PathVariable Long id, @RequestBody Shelf shelf) {
        try {
            return ResponseEntity.ok(shelfService.updateShelf(id, shelf));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShelf(@PathVariable Long id) {
        shelfService.deleteShelf(id);
        return ResponseEntity.noContent().build();
    }
}