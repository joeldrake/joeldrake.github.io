/**
 * @param {string} str
 */
export function isValidArticleId(str) {
  if (!str?.length || str.length > 14) return false;
  return /^[0-9]+$/.test(str); // Check if string only contains numbers
}
