import bcrypt from 'bcryptjs'
import crypto from 'crypto'

async function generateHashedPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hashed = await bcrypt.hash(password + salt, 10)
  console.log('Salt:', salt)
  console.log('Hashed Password:', hashed)
}

generateHashedPassword('zivo01')
