/** Resolve cart line image — supports full URLs, local paths, and API-relative paths. */
export function resolveCartImageSrc(image: string): string {
  if (!image) return '/livewire.png';
  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/')
  ) {
    return image;
  }
  const base = process.env.NEXT_PUBLIC_IMG_URL ?? '';
  return base ? `${base}/${image}` : image;
}
