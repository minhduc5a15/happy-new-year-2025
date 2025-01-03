import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function createSVGTexture(width: number, height: number): string {
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#000000"/>
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 4}" fill="#ffffff"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#000000" text-anchor="middle" dominant-baseline="middle">2025</text>
    </svg>
  `;
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}
