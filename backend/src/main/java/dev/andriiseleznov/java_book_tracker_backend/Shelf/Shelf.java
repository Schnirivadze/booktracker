package dev.andriiseleznov.java_book_tracker_backend.Shelf;

import java.util.ArrayList;
import java.util.List;

import dev.andriiseleznov.java_book_tracker_backend.Book.Book;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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

    @OneToMany
    @JoinColumn(name = "shelf_id", referencedColumnName = "id")
    private List<Book> books = new ArrayList<Book>();

    @Column(name = "shelf_group_id", nullable = false)
    private Long shelfGroupId;

    public Shelf() {
    }

    public Shelf(Long id, String name, Integer x, Integer y, List<Book> books, Long shelfGroupId) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.books = books;
        this.shelfGroupId = shelfGroupId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public Long getShelfGroupId() {
        return shelfGroupId;
    }

    public void setShelfGroupId(Long shelfGroupId) {
        this.shelfGroupId = shelfGroupId;
    }

}
