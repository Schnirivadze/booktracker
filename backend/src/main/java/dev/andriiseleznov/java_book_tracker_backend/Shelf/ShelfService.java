package dev.andriiseleznov.java_book_tracker_backend.Shelf;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelfService {

    private final ShelfRepository shelfRepository;

    public ShelfService(ShelfRepository shelfRepository) {
        this.shelfRepository = shelfRepository;
    }

    public List<Shelf> getAllShelves() {
        return shelfRepository.findAll();
    }

    public Optional<Shelf> getShelfById(Long id) {
        return shelfRepository.findById(id);
    }

    public Shelf createShelf(Shelf shelf) {
        return shelfRepository.save(shelf);
    }

    public Shelf updateShelf(Long id, Shelf updatedShelf) {
        return shelfRepository.findById(id).map(existingShelf -> {
            existingShelf.setName(updatedShelf.getName());
            existingShelf.setX(updatedShelf.getX());
            existingShelf.setY(updatedShelf.getY());
            existingShelf.setShelfGroupId(updatedShelf.getShelfGroupId());
            return shelfRepository.save(existingShelf);
        }).orElseThrow(() -> new RuntimeException("Shelf not found"));
    }

    public void addBookToShelf(Long shelfId, Long bookId) {
        Shelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() -> new RuntimeException("Shelf not found"));
        shelf.getBookIds().add(bookId);
        shelfRepository.save(shelf);
    }

    public void deleteShelf(Long id) {
        shelfRepository.deleteById(id);
    }
}
