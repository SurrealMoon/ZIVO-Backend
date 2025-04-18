import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        roles?: string[]
      }
    }
  }
}

export {} // Bu satır gerekli, tür genişletme için