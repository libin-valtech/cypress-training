import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, 'cypress', { expiresIn: '30d' })
}

export default generateToken
