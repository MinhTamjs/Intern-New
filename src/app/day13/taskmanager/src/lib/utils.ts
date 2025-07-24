import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility gộp className với logic điều kiện và merge tailwind conflict
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
