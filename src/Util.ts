export function formatDate(date: string | Date) {
    let formatted;
    if (date instanceof Date) {
        formatted = date.toISOString();
    } else {
        formatted = date;
    }

    return formatted;
}