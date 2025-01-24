package dev.andriiseleznov.java_book_tracker_backend.Book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
	public Optional<Book> findById(Long id);

	List<Book> findByShelfId(Long shelfId);

	List<Book> findByTitleContainingIgnoreCase(String title);

	List<Book> findByAuthorContainingIgnoreCase(String author);

	List<Book> findByTagsContaining(String tag);

	// Search books within a specific ShelfGroup
	@Query("SELECT b FROM Book b " +
			"WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			":keyword MEMBER OF b.tags) " +
			"AND b.shelfId IN (SELECT s.id FROM Shelf s WHERE s.shelfGroupId = :shelfGroupId)")
	List<Book> searchBooksByShelfGroup(@Param("keyword") String keyword, @Param("shelfGroupId") Long shelfGroupId);

	// Search books within a specific Shelf
	@Query("SELECT b FROM Book b " +
			"WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			"LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
			":keyword MEMBER OF b.tags) " +
			"AND b.shelfId = :shelfId")
	List<Book> searchBooksByShelf(@Param("keyword") String keyword, @Param("shelfId") Long shelfId);

}
