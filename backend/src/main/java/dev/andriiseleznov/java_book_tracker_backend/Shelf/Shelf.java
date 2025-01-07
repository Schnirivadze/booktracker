package dev.andriiseleznov.java_book_tracker_backend.Shelf;

import java.util.ArrayList;
import java.util.List;

import dev.andriiseleznov.java_book_tracker_backend.Book.Book;
import dev.andriiseleznov.java_book_tracker_backend.ShelfGroup.ShelfGroup;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "shelves")
public class Shelf {

    @Id
    @SequenceGenerator(name = "shelf_sequence", sequenceName = "shelf_sequence", allocationSize = 1)
    @GeneratedValue(generator = "shelf_sequence", strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "dimentions_x", nullable = false)
    private Integer x;

    @Column(name = "dimentions_y", nullable = false)
    private Integer y;

    @OneToMany(mappedBy = "shelf")
    private List<Book> books = new ArrayList<Book>();

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shelf_group_id", referencedColumnName = "id")
    private ShelfGroup shelfGroup;
}
