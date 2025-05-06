import { S3Service } from '../services/s3-service'

const s3Service = new S3Service()



export async function getPresignedPhotoUrl(key: string): Promise<string> {
  return await s3Service.getPresignedDownloadUrl(key)
}

