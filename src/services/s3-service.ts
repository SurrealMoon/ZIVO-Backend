  import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  import { config } from 'dotenv';
  import { Readable } from 'stream';
  import crypto from 'crypto';
  import path from 'path';
  import { GetObjectCommand } from '@aws-sdk/client-s3';

  config(); // .env dosyasını yükle

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

  export class S3Service {
    async uploadFile(fileBuffer: Buffer, originalName: string, folder: string): Promise<string> {
      const fileName = `${folder}/${Date.now()}-${this.sanitizeFileName(originalName)}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ACL: 'private',
      });

      await s3.send(command);
      return fileName;
    }

    async deleteFile(objectKey: string): Promise<void> {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
      });

      await s3.send(command);
    }

    async getPresignedUrl(objectKey: string, expirySeconds = 60 * 5): Promise<string> {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
      });

      return await getSignedUrl(s3, command, { expiresIn: expirySeconds });
    }

    private sanitizeFileName(filename: string): string {
      return path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
    }

    async getPresignedDownloadUrl(objectKey: string, contentType = 'application/octet-stream', expirySeconds = 300): Promise<string> {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        ResponseContentDisposition: 'inline',
        ResponseContentType: contentType, // DİNAMİK type
      });
    
      return await getSignedUrl(s3, command, { expiresIn: expirySeconds });
    }
  }


