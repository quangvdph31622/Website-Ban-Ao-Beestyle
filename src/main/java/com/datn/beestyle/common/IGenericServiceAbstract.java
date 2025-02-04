package com.datn.beestyle.common;

import com.datn.beestyle.dto.PageResponse;
import com.datn.beestyle.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public abstract class IGenericServiceAbstract<T, ID, C, U, R> implements IGenericService<T, ID, C, U, R> {

    protected final IGenericRepository<T, ID> entityRepository;
    protected final IGenericMapper<T, C, U, R> mapper;

    protected IGenericServiceAbstract(IGenericRepository<T, ID> entityRepository, IGenericMapper<T, C, U, R> mapper) {
        this.entityRepository = entityRepository;
        this.mapper = mapper;
    }

    @Override
    public PageResponse<?> getAll(Pageable pageable) {
        Page<T> entityPage = entityRepository.findAll(pageable);
        List<R> result = mapper.toEntityDtoList(entityPage.getContent());
        return PageResponse.builder()
                .pageNo(pageable.getPageNumber() + 1)
                .pageSize(pageable.getPageSize())
                .totalElements(entityPage.getTotalElements())
                .totalPages(entityPage.getTotalPages())
                .items(result)
                .build();
    }

    @Transactional
    @Override
    public R create(C request) {
        this.beforeCreate(request);
        T entity = mapper.toCreateEntity(request);
        this.afterConvertCreateRequest(request, entity);
        return mapper.toEntityDto(entityRepository.save(entity));
    }

    @Transactional
    @Override
    public R update(ID id, U request) {
        T entity = this.getById(id);
        this.beforeUpdate(request);
        mapper.toUpdateEntity(entity, request);
        this.afterConvertUpdateRequest(request, entity);
        return mapper.toEntityDto(entityRepository.save(entity));
    }

    @Override
    public void delete(ID id) {
        entityRepository.deleteById(id);
    }

    @Override
    public R getDtoById(ID id) {
        return mapper.toEntityDto(this.getById(id));
    }

    @Override
    public T getById(ID id) {
        return entityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(this.getEntityName() + " not found."));
    }

    protected abstract void beforeCreate(C request);
    protected abstract void beforeUpdate(U request);
    protected abstract void afterConvertCreateRequest(C request, T entity);
    protected abstract void afterConvertUpdateRequest(U request, T entity);
    protected abstract String getEntityName();
}
