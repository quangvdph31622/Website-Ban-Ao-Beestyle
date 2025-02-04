package com.datn.beestyle.repository;

import com.datn.beestyle.common.IGenericRepository;
import com.datn.beestyle.entity.product.properties.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends IGenericRepository<Material, Integer> {
    @Query("""
            select m from Material m where :name is null or m.materialName like concat('%', :name, '%')
            """)
    Page<Material> findAllByNameContaining(Pageable pageable, String name);
}
