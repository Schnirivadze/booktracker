package dev.andriiseleznov.java_book_tracker_backend.ShelfGroup;

import dev.andriiseleznov.java_book_tracker_backend.Shelf.Shelf;
import dev.andriiseleznov.java_book_tracker_backend.User.User;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "shelf_groups")
public class ShelfGroup {

    @Id
    @SequenceGenerator(name = "shelf_group_sequence", sequenceName = "shelf_group_sequence", allocationSize = 1)
    @GeneratedValue(generator = "shelf_group_sequence", strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "shelfGroup")
    private List<Shelf> shelves;

    @ManyToMany(mappedBy = "shelfGroups")
    private List<User> users;
}
