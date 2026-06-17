/**
 * Shared helpers for client-side file/image validation.
 *
 * Keeping the limit in one constant means any UI that does pre-upload
 * checks (profile photo, review images, etc.) stays consistent and we
 * only have to bump one number to change the limit project-wide.
 */

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const IMAGE_MAX_MB = Math.round(IMAGE_MAX_BYTES / (1024 * 1024));

/** True when the file is at or below the allowed image size. */
export function isImageFileSizeValid(file: File): boolean {
  return file.size <= IMAGE_MAX_BYTES;
}

/** Standardised toast/error copy when a file exceeds the limit. */
export function getImageFileTooLargeMessage(): string {
  return `Image is too large. Maximum allowed size is ${IMAGE_MAX_MB} MB.`;
}
