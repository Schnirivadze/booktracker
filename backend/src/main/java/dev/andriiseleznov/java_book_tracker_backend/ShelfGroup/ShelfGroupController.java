package dev.andriiseleznov.java_book_tracker_backend.ShelfGroup;

import dev.andriiseleznov.java_book_tracker_backend.User.User;
import dev.andriiseleznov.java_book_tracker_backend.User.UserService;
import dev.andriiseleznov.java_book_tracker_backend.Util.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shelf-groups")
public class ShelfGroupController {

    private final ShelfGroupService shelfGroupService;
    private final UserService userService;
    private final JwtUtil jwtUtil; // Inject JwtUtil to validate JWT token

    public ShelfGroupController(ShelfGroupService shelfGroupService, UserService userService, JwtUtil jwtUtil) {
        this.shelfGroupService = shelfGroupService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShelfGroup> getShelfGroupById(@PathVariable Long id) {
        Optional<ShelfGroup> shelfGroup = shelfGroupService.getShelfGroupById(id);
        if (shelfGroup.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(shelfGroup.get());
    }

    @GetMapping("/{shelfGroupId}/shelves")
    public ResponseEntity<List<Long>> getShelfGroupShelvesIds(@PathVariable Long shelfGroupId) {
        if (!shelfGroupService.shelfGroupExistsById(shelfGroupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(shelfGroupService.getShelfGroupShelvesIds(shelfGroupId));
    }

    @PostMapping
    public ResponseEntity<ShelfGroup> createShelfGroup(@RequestBody ShelfGroup shelfGroup) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shelfGroupService.createShelfGroup(shelfGroup));
    }

    @PutMapping("/{shelfGroupId}/users")
    public ResponseEntity<String> addUserToShelfGroup(@PathVariable Long shelfGroupId,
            @RequestHeader("Authorization") String token) {
        // Extract the username from the JWT token
        String username = jwtUtil.extractUsername(token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> user = userService.getUserByLogin(username);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: User does not exist.");
        }

        if (!shelfGroupService.shelfGroupExistsById(shelfGroupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShelfGroup not found");
        }

        shelfGroupService.addUserToShelfGroup(shelfGroupId, user.get().getId());
        return ResponseEntity.ok("User added to ShelfGroup successfully");
    }

    @PutMapping("/{shelfGroupId}/shelves/{shelfId}")
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