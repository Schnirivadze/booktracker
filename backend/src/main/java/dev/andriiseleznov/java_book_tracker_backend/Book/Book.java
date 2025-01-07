package dev.andriiseleznov.java_book_tracker_backend.Book;

import dev.andriiseleznov.java_book_tracker_backend.Shelf.Shelf;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @SequenceGenerator(name = "book_sequence", sequenceName = "book_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "book_sequence")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author", nullable = false)
    private String author;

    @Column(name = "description", nullable = true)
    private String description;

    @ElementCollection
    private List<String> tags;

    @Column(name = "position_x", nullable = false)
    private Integer x;

    @Column(name = "position_y", nullable = false)
    private Integer y;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shelf_id",referencedColumnName = "id")
    private Shelf shelf;
}
