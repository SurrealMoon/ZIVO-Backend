import mime from 'mime-types'
import { S3Service } from '../services/s3-service'

const s3Service = new S3Service()

export async function getPresignedPhotoUrl(key: string): Promise<string> {
  const extension = key.split('.').pop()
  const contentType = mime.lookup(extension || '') || 'application/octet-stream'
  return await s3Service.getPresignedDownloadUrl(key, contentType)
}

