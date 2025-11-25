import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const themeColors = [
  "#FF69B4", // HotPink
  "#33FF57", // LimeGreen
  "#3357FF", // Blue
  "#FF33A1", // Pink
  "#A133FF", // Purple
  "#33FFF5", // Cyan
  "#FFC300", // Yellow
];

export const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
];
