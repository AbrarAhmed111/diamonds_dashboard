import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
