// some little utilities :3 

/**
 * check if a string is null, empty, or whitespace
 * @param {string} str input string to test 
 * @returns true if blank, false if contains content
 */
export const isBlank = str => !str || !str.trim();