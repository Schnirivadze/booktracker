package dev.andriiseleznov.java_book_tracker_backend.User;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    public void createUser(User user) {
        user.setPassword(hashPassword(user.getPassword()));
        userRepository.save(user);
    }

    public void updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        existingUser.setLogin(updatedUser.getLogin());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setShelfGroupIds(updatedUser.getShelfGroupIds());

        userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private String hashPassword(String rawPassword) {
        return rawPassword;
    }

    public Optional<User> authenticate(String login, String rawPassword) {
        Optional<User> user = userRepository.findByLogin(login);
        if (user.isPresent() && rawPassword.equals(user.get().getPassword())) {
            return user;
        }

        return Optional.empty();
    }

}