import words from 'an-array-of-english-words'

/**
 * Generates a random name by combining two randomly selected short words (each with a maximum length of 8 characters) from the `words` array.
 *
 * @returns {string} A string in the format `word1-word2`, where both words are randomly chosen short words.
 */
export const generateRandomName = (): string => {
  const shortWords = words.filter((word) => word.length <= 8)
  const randomWord1 = shortWords[Math.floor(Math.random() * shortWords.length)]
  const randomWord2 = shortWords[Math.floor(Math.random() * shortWords.length)]
  return `${randomWord1}-${randomWord2}`
}
