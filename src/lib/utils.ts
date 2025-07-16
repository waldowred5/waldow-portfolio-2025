import { type ClassValue,clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const convertToHex = (color: number[]) => {
  if (color.length !== 3) {
    throw new Error('Color array must have exactly three elements.');
  }

  return `#${color.map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`;
};
