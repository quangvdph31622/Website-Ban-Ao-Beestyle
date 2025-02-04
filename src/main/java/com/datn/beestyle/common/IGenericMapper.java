package com.datn.beestyle.common;

import java.util.List;

public interface IGenericMapper<T, C, U, R> {
    R toEntityDto(T entity);
    List<R> toEntityDtoList(List<T> entityList);
    T toCreateEntity(C request);
    void toUpdateEntity(T entity, U request);
    List<T> toCreateEntityList(List<C> dtoCreateList);
}
