export function validId() {
    return Math.random().toString(36).substring(2, 10);
}

//debounce function
export function debounce(func, delay) {
    let timeout;
    return function (...args) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func.apply(this, args);
            timeout = null;
        }, delay);
    };
}

//throttle function
export function throttle(func, delay) {
    let timeout = null;
    return function (...args) {
        if (timeout) {
            return;
        }
        timeout = setTimeout(() => {
            func.apply(this, args);
            timeout = null;
        }, delay);
    }
}
