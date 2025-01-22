package dev.andriiseleznov.java_book_tracker_backend.ShelfGroup;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "shelf_group_user_ids", joinColumns = @JoinColumn(name = "shelf_group_id"))
    @Column(name = "user_id")
    private List<Long> userIds = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "shelf_group_shelf_ids", joinColumns = @JoinColumn(name = "shelf_group_id"))
    @Column(name = "shelf_id")
    private List<Long> shelfIds = new ArrayList<>();

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

    public List<Long> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Long> userIds) {
        this.userIds = userIds;
    }

    public List<Long> getShelfIds() {
        return shelfIds;
    }

    public void setShelfIds(List<Long> shelfIds) {
        this.shelfIds = shelfIds;
    }

}
