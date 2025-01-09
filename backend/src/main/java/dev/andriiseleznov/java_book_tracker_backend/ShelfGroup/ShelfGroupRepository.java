package dev.andriiseleznov.java_book_tracker_backend.ShelfGroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShelfGroupRepository extends JpaRepository<ShelfGroup, Long> {

}
