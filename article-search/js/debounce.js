/**
 * Creates a debounced version of a function that delays execution until after
 * the specified delay has elapsed since the last time it was invoked
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds to wait before executing
 * @returns {Function} The debounced function
 */
export function debounce(func, delay) {
  let timeoutId = null;

  return function (...args) {
    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(this, args);
    }, delay);
  };
}
