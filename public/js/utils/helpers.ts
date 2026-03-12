export function validId(): string {
    return Math.random().toString(36).substring(2, 10);
}

//debounce function
export function debounce(func: Function, delay: number) {
    let timeout: number | null = null;
    return function (...args: unknown[]) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
            timeout = null;
        }, delay);
    };
}

//throttle function
export function throttle(func: Function, delay: number) {
    let timeout: number | null = null;
    return function (...args: unknown[]) {
        if (timeout) {
            return;
        }
        timeout = setTimeout(() => {
            func(...args);
            timeout = null;
        }, delay);
    }
}