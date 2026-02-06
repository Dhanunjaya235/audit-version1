/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last call.
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function debounced(...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * Creates a debounced function with immediate execution option.
 * If immediate is true, trigger the function on the leading edge instead of trailing.
 */
export function debounceWithImmediate<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function debounced(...args: Parameters<T>) {
        const callNow = immediate && !timeoutId;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            timeoutId = null;
            if (!immediate) {
                func(...args);
            }
        }, wait);

        if (callNow) {
            func(...args);
        }
    };
}
