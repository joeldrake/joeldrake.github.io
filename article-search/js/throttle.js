/**
 * Creates a throttled version of a function with trailing-edge execution only
 * @param {Function} func - The function to throttle
 * @param {number} delay - The delay in milliseconds between function executions
 * @returns {Function} The throttled function
 */
export function throttle(func, delay) {
	let timeoutId = null;

	return function (...args) {
		if (timeoutId) return;

		timeoutId = setTimeout(() => {
			timeoutId = null;
			func.apply(this, args);
		}, delay);
	};
}
