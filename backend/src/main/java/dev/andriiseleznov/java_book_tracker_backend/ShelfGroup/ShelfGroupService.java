package dev.andriiseleznov.java_book_tracker_backend.ShelfGroup;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.andriiseleznov.java_book_tracker_backend.Shelf.Shelf;
import dev.andriiseleznov.java_book_tracker_backend.Shelf.ShelfRepository;

@Service
public class ShelfGroupService {

    private final ShelfGroupRepository shelfGroupRepository;
    private final ShelfRepository shelfRepository;

    @Autowired
    public ShelfGroupService(ShelfGroupRepository shelfGroupRepository,
            ShelfRepository shelfRepository) {
        this.shelfGroupRepository = shelfGroupRepository;
        this.shelfRepository = shelfRepository;
    }

    public List<ShelfGroup> getAllShelfGroups() {
        return shelfGroupRepository.findAll();
    }

    public Optional<ShelfGroup> getShelfGroupById(Long id) {
        return shelfGroupRepository.findById(id);
    }

    public List<Long> getShelfGroupShelvesIds(Long id) {
        return shelfGroupRepository.findById(id).get().getShelfIds();
    }

    public ShelfGroup createShelfGroup(ShelfGroup shelfGroup) {
        return shelfGroupRepository.save(shelfGroup);
    }

    public ShelfGroup updateShelfGroup(Long id, ShelfGroup updatedShelfGroup) {
        return shelfGroupRepository.findById(id)
                .map(shelfGroup -> {
                    shelfGroup.setName(updatedShelfGroup.getName());
                    return shelfGroupRepository.save(shelfGroup);
                })
                .orElseThrow(() -> new RuntimeException("ShelfGroup not found"));
    }

    public void deleteShelfGroup(Long id) {
        shelfGroupRepository.deleteById(id);
    }

    @Transactional
    public void addUserToShelfGroup(Long shelfGroupId, Long userId) {
        ShelfGroup shelfGroup = shelfGroupRepository.findById(shelfGroupId)
                .orElseThrow(() -> new IllegalArgumentException("ShelfGroup not found"));

        if (!shelfGroup.getUserIds().contains(userId)) {
            shelfGroup.getUserIds().add(userId);
            shelfGroupRepository.save(shelfGroup);
        }
    }

    @Transactional
    public void addShelfToShelfGroup(Long shelfGroupId, Long shelfId) {
        ShelfGroup shelfGroup = shelfGroupRepository.findById(shelfGroupId)
                .orElseThrow(() -> new RuntimeException("ShelfGroup not found"));
        Shelf shelf = shelfRepository.findById(shelfId).orElseThrow(() -> new RuntimeException("Shelf not found"));

        if (!shelfGroup.getShelfIds().contains(shelfId)) {
            shelfGroup.getShelfIds().add(shelfId);
            shelf.setShelfGroupId(shelfGroup.getId());
        }
    }

    public boolean shelfGroupExistsById(Long shelfGroupId) {
        return shelfGroupRepository.existsById(shelfGroupId);
    }
}
