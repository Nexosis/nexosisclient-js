import { ListQueryable } from './Types';

export function formatDate(date: string | Date) {
    let formatted;
    if (date instanceof Date) {
        formatted = date.toISOString();
    } else {
        formatted = date;
    }

    return formatted;
}

export function addListQueryParameters(queryObject: ListQueryable, parameters: object) {

    if (queryObject.sortBy) {
        Object.defineProperty(parameters, 'sortBy', {
            value: queryObject.sortBy,
            enumerable: true
        });
    }

    if (queryObject.sortOrder) {
        Object.defineProperty(parameters, 'sortOrder', {
            value: queryObject.sortOrder,
            enumerable: true
        });
    }

    if (queryObject.page) {
        Object.defineProperty(parameters, 'page', {
            value: queryObject.page,
            enumerable: true
        });
    }

    if (queryObject.pageSize) {
        Object.defineProperty(parameters, 'pageSize', {
            value: queryObject.pageSize,
            enumerable: true
        });
    }
}