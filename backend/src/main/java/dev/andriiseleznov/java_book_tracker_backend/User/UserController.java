package dev.andriiseleznov.java_book_tracker_backend.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.andriiseleznov.java_book_tracker_backend.ShelfGroup.ShelfGroupService;
import dev.andriiseleznov.java_book_tracker_backend.Util.JwtUtil;

import java.util.Optional;

@RestController
@RequestMapping(path = "api/users")
public class UserController {
	private final UserService userService;
	private final ShelfGroupService shelfGroupService;
	private final JwtUtil jwtUtil;

	public UserController(UserService userService, ShelfGroupService shelfGroupService, JwtUtil jwtUtil) {
		this.userService = userService;
		this.shelfGroupService = shelfGroupService;
		this.jwtUtil = jwtUtil;
	}

	@GetMapping("/info")
	public ResponseEntity<User> getUserInfo(@RequestHeader("Authorization") String token) {
		String login = jwtUtil.extractUsername(token.replace("Bearer ", ""));
		if (login == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<User> user = userService.getUserByLogin(login);
		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		User userToReturn = user.get();
		userToReturn.setPassword(null); // Hide password
		return ResponseEntity.ok(userToReturn);
	}

	@PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userService.getUserByLogin(user.getLogin()).isPresent() || userService.getUserByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Registration failed: Login or email is already taken.");
        }

        try {
            userService.createUser(user);
            return ResponseEntity.status(201).body("User registered successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body("Registration failed: " + e.getMessage());
        }
    }

	@PutMapping("/update")
	public ResponseEntity<String> updateUser(@RequestHeader("Authorization") String token,
			@RequestBody User updatedUser) {
		String login = jwtUtil.extractUsername(token.replace("Bearer ", ""));
		if (login == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<User> user = userService.getUserByLogin(login);
		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		userService.updateUser(user.get().getId(), updatedUser);
		return ResponseEntity.ok("User updated successfully");
	}

	@PutMapping("/shelf-groups/{shelfGroupId}")
	public ResponseEntity<String> addShelfGroupToUser(@RequestHeader("Authorization") String token,
			@PathVariable Long shelfGroupId) {
		String login = jwtUtil.extractUsername(token.replace("Bearer ", ""));
		if (login == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<User> user = userService.getUserByLogin(login);
		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		if (!shelfGroupService.shelfGroupExistsById(shelfGroupId)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ShelfGroup not found");
		}

		User userToUpdate = user.get();
		if (userToUpdate.getShelfGroupIds().contains(shelfGroupId)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is already part of this ShelfGroup");
		}

		userToUpdate.getShelfGroupIds().add(shelfGroupId);
		userService.updateUser(userToUpdate.getId(), userToUpdate);

		return ResponseEntity.ok("ShelfGroup added to user successfully");
	}

	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token) {
		String login = jwtUtil.extractUsername(token.replace("Bearer ", ""));
		if (login == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<User> user = userService.getUserByLogin(login);
		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		userService.deleteUser(user.get().getId());
		return ResponseEntity.ok("User deleted successfully");
	}
}