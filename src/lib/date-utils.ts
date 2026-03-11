export function parseUTCToLocal(date: Date | string): Date {
    const d = typeof date === 'string' ? new Date(date) : date;

    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}