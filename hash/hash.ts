import crypto from 'crypto'

const digest = 'sha256' // Digest method for the PBKDF2 algorithm
const iterations = 100000 // Number of iterations for the PBKDF2 algorithm
const keyLength = 32 // Desired key length for the derived key
const saltSize = 12 // Size of the salt to be generated

/**
 * Generates a password hash using the PBKDF2 algorithm
 * @param {string} password - Plaintext password to be hashed
 * @return {Promise<string>} - A promise that resolves to the hashed password
 *                             in the format of "pbkdf2_digest$iterations$salt$key"
 */
export async function generatePasswordHash(password: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(saltSize * 8, (error, salt) => {
      if (error) {
        return reject(error)
      }

      // Convert the binary salt to base64, remove "+" and "/" characters and trim to desired length
      const salt_str = Buffer.from(salt)
        .toString('base64')
        .replace(/\+/g, '')
        .replace(/\//g, '')
        .substring(0, saltSize)

      crypto.pbkdf2(
        password,
        salt_str,
        iterations,
        keyLength,
        digest,
        (error, derivedKey) => {
          if (error) {
            return reject(error)
          }
          resolve(
            `pbkdf2_${digest}$${iterations}$${salt_str}$${derivedKey.toString(
              'base64'
            )}`
          )
        }
      )
    })
  })
}

/**
 * Verifies a plaintext password against a hashed password
 * @param {string} password - Plaintext password to be verified
 * @param {string} hash - Hashed password in the format of "pbkdf2_digest$iterations$salt$key"
 * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the plaintext password matches the hashed password
 */
export async function verify(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    try {
      const keyLength = 32
      // Split the hashed password into its components
      const arrHash = hash.split('$')
      const digest = arrHash[0].split('_')[1]
      const iterations = +arrHash[1]
      const salt = arrHash[2]
      const key = arrHash[3]

      crypto.pbkdf2(
        password,
        salt,
        iterations,
        keyLength,
        digest,
        (error, derivedKey): void => {
          if (error) {
            return reject(error)
          }

          // Compare the newly hashed password with the original hashed password
          resolve(derivedKey.toString('base64') === key)
        }
      )
    } catch (error) {
      return reject(error)
    }
  })
}
