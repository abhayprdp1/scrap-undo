import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client | null = null;
  private bucket: string;
  private region: string;

  constructor(private config: ConfigService) {
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    this.region = this.config.get<string>('AWS_REGION') || 'ap-south-1';
    this.bucket = this.config.get<string>('AWS_S3_BUCKET') || 'scrapconnect-images';

    if (accessKeyId && secretAccessKey && accessKeyId !== 'your_aws_access_key') {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      this.logger.warn('AWS S3 credentials not configured; S3 mock mode enabled');
    }
  }

  async getPresignedUrl(key: string, contentType: string = 'image/jpeg'): Promise<string> {
    if (!this.s3Client) {
      // Mock pre-signed URL for local/demo development
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}?mock-upload=true`;
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 900 });
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
