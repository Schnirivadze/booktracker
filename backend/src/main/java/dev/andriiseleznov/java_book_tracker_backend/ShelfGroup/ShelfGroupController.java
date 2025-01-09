package dev.andriiseleznov.java_book_tracker_backend.ShelfGroup;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.andriiseleznov.java_book_tracker_backend.User.LoginRequest;
import dev.andriiseleznov.java_book_tracker_backend.User.UserService;
import dev.andriiseleznov.java_book_tracker_backend.User.User;

@RestController
@RequestMapping("/api/shelf-groups")
public class ShelfGroupController {

    private final ShelfGroupService shelfGroupService;
    private final UserService userService;

    @Autowired
    public ShelfGroupController(ShelfGroupService shelfGroupService, UserService userService) {
        this.shelfGroupService = shelfGroupService;
        this.userService = userService;
    }

    @GetMapping("/{shelfGroupId}/shelves/")
    public ResponseEntity<List<Long>> getShelfGroupShelvesIds(@PathVariable Long shelfGroupId) {
        if (!shelfGroupService.shelfGroupExistsById(shelfGroupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(shelfGroupService.getShelfGroupShelvesIds(shelfGroupId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShelfGroup> getShelfGroupById(@PathVariable Long id) {
        Optional<ShelfGroup> shelfGroup = shelfGroupService.getShelfGroupById(id);
        if (shelfGroup.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(shelfGroup.get());
    }

    @PostMapping
    public ResponseEntity<ShelfGroup> createShelfGroup(@RequestBody ShelfGroup shelfGroup) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shelfGroupService.createShelfGroup(shelfGroup));
    }

    @PostMapping("/{shelfGroupId}/users/")
    public ResponseEntity<String> addUserToShelfGroup(@PathVariable Long shelfGroupId,
            @RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.authenticate(loginRequest.getLogin(), loginRequest.getPassword());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login or password");
        }

        if (!shelfGroupService.shelfGroupExistsById(shelfGroupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShelfGroup not found");
        }

        shelfGroupService.addUserToShelfGroup(shelfGroupId, user.get().getId());
        return ResponseEntity.ok("User added to ShelfGroup successfully");
    }

    @PostMapping("/{shelfGroupId}/shelves/{shelfId}")
    public ResponseEntity<String> addShelfToShelfGroup(@PathVariable Long shelfGroupId, @PathVariable Long shelfId) {
        if (!shelfGroupService.shelfGroupExistsById(shelfGroupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShelfGroup not found");
        }

        shelfGroupService.addShelfToShelfGroup(shelfGroupId, shelfId);
        return ResponseEntity.ok("Shelf added to ShelfGroup successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShelfGroup> updateShelfGroup(@PathVariable Long id, @RequestBody ShelfGroup shelfGroup) {
        if (!shelfGroupService.shelfGroupExistsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(shelfGroupService.updateShelfGroup(id, shelfGroup));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShelfGroup(@PathVariable Long id) {
        if (!shelfGroupService.shelfGroupExistsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShelfGroup not found");
        }
        shelfGroupService.deleteShelfGroup(id);
        return ResponseEntity.ok("ShelfGroup deleted successfully");
    }
}