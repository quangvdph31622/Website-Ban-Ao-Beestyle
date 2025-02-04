package com.datn.beestyle.service.material;

import com.datn.beestyle.common.IGenericMapper;
import com.datn.beestyle.common.IGenericRepository;
import com.datn.beestyle.common.IGenericServiceAbstract;
import com.datn.beestyle.dto.PageResponse;
import com.datn.beestyle.dto.material.CreateMaterialRequest;
import com.datn.beestyle.dto.material.MaterialResponse;
import com.datn.beestyle.dto.material.UpdateMaterialRequest;
import com.datn.beestyle.entity.product.properties.Material;
import com.datn.beestyle.mapper.MaterialMapper;
import com.datn.beestyle.repository.MaterialRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class MaterialService
        extends IGenericServiceAbstract<Material, Integer, CreateMaterialRequest, UpdateMaterialRequest, MaterialResponse>
        implements IMaterialService {

    private final MaterialRepository materialRepository;

    protected MaterialService(IGenericRepository<Material, Integer> entityRepository,
                              IGenericMapper<Material, CreateMaterialRequest, UpdateMaterialRequest, MaterialResponse> mapper,
                              MaterialRepository materialRepository, MaterialMapper materialMapper) {
        super(entityRepository, mapper);
        this.materialRepository = materialRepository;
    }


    @Override
    public PageResponse<?> searchByName(Pageable pageable, String name) {
        Page<Material> materialPage = materialRepository.findAllByNameContaining(pageable, name);
        List<MaterialResponse> materialResponseList = mapper.toEntityDtoList(materialPage.getContent());
        return PageResponse.builder()
                .pageNo(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .totalElements(materialPage.getTotalElements())
                .totalPages(materialPage.getTotalPages())
                .items(materialResponseList)
                .build();
    }

    @Override
    public List<MaterialResponse> createMaterials(List<CreateMaterialRequest> requestList) {
        List<Material> materialList = mapper.toCreateEntityList(requestList);
        return mapper.toEntityDtoList(materialRepository.saveAll(materialList));
    }

    @Override
    protected void beforeCreate(CreateMaterialRequest request) {

    }

    @Override
    protected void beforeUpdate(UpdateMaterialRequest request) {

    }

    @Override
    protected void afterConvertCreateRequest(CreateMaterialRequest request, Material entity) {

    }

    @Override
    protected void afterConvertUpdateRequest(UpdateMaterialRequest request, Material entity) {

    }

    @Override
    protected String getEntityName() {
        return "Material";
    }


}
