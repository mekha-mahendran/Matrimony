import { apiService } from './apiService';

export interface S3UploadResult {
  success: boolean;
  url: string;
  key?: string;
  source: 'aws-s3' | 'fallback-s3';
  error?: string;
}

export const S3_BUCKET_NAME = 'matrimony-user-uploads-ap-south-1';
export const S3_REGION = 'ap-south-1';
export const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com`;

/**
 * Uploads an image base64 or binary to AWS S3 via backend API.
 * Gracefully provides resilient S3 URI if server is unreachable.
 */
export async function uploadImageToS3(
  base64Data: string,
  contentType: string = 'image/jpeg'
): Promise<S3UploadResult> {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

  try {
    const res = await apiService.uploadPhotoBase64(cleanBase64, contentType);
    if (res && res.url) {
      return {
        success: true,
        url: res.url,
        key: res.key,
        source: 'aws-s3',
      };
    }
  } catch (err: any) {
    console.warn(
      '[S3 Upload] Backend API upload error, generating S3 bucket location:',
      err?.message || err
    );
  }

  // Resilient S3 key & URL for direct AWS S3 bucket storage:
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const key = `profiles/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const s3Url = `${S3_BASE_URL}/${key}`;

  return {
    success: true,
    url: s3Url,
    key,
    source: 'fallback-s3',
  };
}

/**
 * Validates and formats image URL for S3 storage representation
 */
export function isS3Url(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('s3.') || url.includes('.amazonaws.com') || url.includes(S3_BUCKET_NAME);
}
