package com.alumninetwork.hub.repository;

import com.alumninetwork.hub.entity.Role;
import com.alumninetwork.hub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByPasswordResetToken(String token);

    Page<User> findByRole(Role role, Pageable pageable);

    @Query("""
        SELECT u FROM User u
        WHERE u.role = :role
        AND (:department IS NULL OR u.department = :department)
        AND (:graduationYear IS NULL OR u.graduationYear = :graduationYear)
        AND (:company IS NULL OR LOWER(u.company) LIKE :companyPattern)
        AND (:search IS NULL OR LOWER(u.fullName) LIKE :searchPattern
             OR LOWER(u.email) LIKE :searchPattern)
        """)
    Page<User> findAlumniWithFilters(
            @Param("role") Role role,
            @Param("department") String department,
            @Param("graduationYear") Integer graduationYear,
            @Param("company") String company,
            @Param("companyPattern") String companyPattern,
            @Param("search") String search,
            @Param("searchPattern") String searchPattern,
            Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.availableForMentorship = true ORDER BY u.createdAt DESC")
    List<User> findMentors(@Param("role") Role role, Pageable pageable);

    long countByRole(Role role);
}
