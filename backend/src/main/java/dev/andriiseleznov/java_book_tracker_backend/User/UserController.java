package dev.andriiseleznov.java_book_tracker_backend.User;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.andriiseleznov.java_book_tracker_backend.ShelfGroup.ShelfGroupService;

@RestController
@RequestMapping(path = "api/users")
public class UserController {
	private final UserService userService;
	private final ShelfGroupService shelfGroupService;

	public UserController(UserService userService, ShelfGroupService shelfGroupService) {
		this.userService = userService;
		this.shelfGroupService = shelfGroupService;
	}

	@GetMapping("/info")
	public ResponseEntity<User> loginAndGetUserInfo(@RequestBody LoginRequest loginRequest) {
		Optional<User> user = userService.authenticate(loginRequest.getLogin(), loginRequest.getPassword());
		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		User userToReturn = user.get();
		userToReturn.setPassword(null);
		return ResponseEntity.ok(userToReturn);
	}

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody User user) {
		try {
			userService.createUser(user);
			return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
		} catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	@PutMapping("/update")
	public ResponseEntity<String> updateUser(
			@RequestBody UpdateRequest updateRequest) {
		Optional<User> user = userService.authenticate(updateRequest.getLogin(), updateRequest.getPassword());

		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		userService.updateUser(user.get().getId(), updateRequest.getUser());
		return ResponseEntity.ok("User updated successfully");
	}

	@Transactional
	@PutMapping("/shelf-groups/{shelfGroupId}")
	public ResponseEntity<String> addShelfGroupToUser(@RequestBody LoginRequest loginRequest,
			@PathVariable Long shelfGroupId) {
		Optional<User> user = userService.authenticate(loginRequest.getLogin(), loginRequest.getPassword());
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
	public ResponseEntity<String> deleteUser(@RequestBody LoginRequest loginRequest) {
		Optional<User> user = userService.authenticate(loginRequest.getLogin(), loginRequest.getPassword());

		if (user.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		userService.deleteUser(user.get().getId());
		return ResponseEntity.ok("User deleted successfully");
	}
}