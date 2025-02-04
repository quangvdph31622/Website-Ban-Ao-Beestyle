package com.datn.beestyle.service.material;

import com.datn.beestyle.dto.PageResponse;
import com.datn.beestyle.dto.material.CreateMaterialRequest;
import com.datn.beestyle.dto.material.MaterialResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IMaterialService {
    PageResponse<?> searchByName(Pageable pageable, String name);
    List<MaterialResponse> createMaterials(List<CreateMaterialRequest> requestList);
}
