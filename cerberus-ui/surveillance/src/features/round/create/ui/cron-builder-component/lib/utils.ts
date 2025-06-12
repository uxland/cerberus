import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CronTheme } from "../types/cronTheme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determina el tema basándose en el color primario del tema
 */
export function getThemeClass(theme?: CronTheme): string {
  if (!theme) return "theme-default";

  // Cerberus theme - color dorado
  if (
    theme.primary === "#FDB813" ||
    theme.primary.includes("#FDB813") ||
    theme.primary.includes("253, 184, 19")
  ) {
    return "theme-cerberus";
  }

  // Dark theme - color azul
  if (
    theme.primary === "#3B82F6" ||
    theme.primary.includes("#3B82F6") ||
    theme.primary.includes("59, 130, 246")
  ) {
    return "theme-dark";
  }

  // Default theme (incluye el nuevo tema claro y CSS variables)
  if (
    theme.primary === "#222F3E" ||
    theme.primary.includes("#222F3E") ||
    theme.primary.includes("hsl(var(--primary))")
  ) {
    return "theme-default";
  }

  // Fallback para cualquier otro tema
  return "theme-default";
}
