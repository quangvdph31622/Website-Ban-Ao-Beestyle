package com.datn.beestyle.controller;

import com.datn.beestyle.dto.ApiResponse;
import com.datn.beestyle.dto.material.CreateMaterialRequest;
import com.datn.beestyle.dto.material.UpdateMaterialRequest;
import com.datn.beestyle.service.material.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/material")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping
    public ApiResponse<?> getCommunes(Pageable pageable, @RequestParam(required = false) String name) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Materials",
                materialService.searchByName(pageable, name));
    }

    @PostMapping("/create")
    public ApiResponse<?> createMaterial(@Valid @RequestBody CreateMaterialRequest request) {
        return new ApiResponse<>(HttpStatus.CREATED.value(), "Material added successfully",
                materialService.create(request));
    }

    @PostMapping("/creates")
    public ApiResponse<?> createMaterials(@Valid @RequestBody List<CreateMaterialRequest> requestList) {
        return new ApiResponse<>(HttpStatus.CREATED.value(), "Materials added successfully",
                materialService.createMaterials(requestList));
    }

    @PutMapping("/update/{id}")
    public ApiResponse<?> updateMaterial(@PathVariable int id, @RequestBody UpdateMaterialRequest request) {
        return new ApiResponse<>(HttpStatus.CREATED.value(), "Material updated successfully",
                materialService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<?> deleteMaterial(@PathVariable int id) {
        materialService.delete(id);
        return new ApiResponse<>(HttpStatus.OK.value(), "Material deleted successfully.");
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getMaterial(@PathVariable int id) {
        return new ApiResponse<>(HttpStatus.OK.value(), "Material", materialService.getDtoById(id));
    }
}
