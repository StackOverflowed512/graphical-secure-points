
import { ClickPoint } from "../types/auth";

// Default images for authentication
export const DEFAULT_AUTH_IMAGES = [
  {
    id: "img1",
    url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    alt: "Authentication Image 1",
  },
  {
    id: "img2",
    url: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    alt: "Authentication Image 2",
  },
  {
    id: "img3",
    url: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    alt: "Authentication Image 3",
  },
];

// Calculate distance between two points
export function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Check if a click is within tolerance of stored points
export function isClickWithinTolerance(
  click: { x: number; y: number },
  storedPoint: { x: number; y: number },
  tolerance: number = 30
): boolean {
  return getDistance(click, storedPoint) <= tolerance;
}

// Generate a unique click point ID
export function generateClickPointId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Get relative coordinates from mouse/touch event
export function getRelativeCoordinates(
  event: React.MouseEvent | React.TouchEvent,
  element: HTMLElement
): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  
  // For mouse events
  if ('clientX' in event) {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  
  // For touch events
  const touch = event.touches[0] || event.changedTouches[0];
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

// Calculate percentages for responsive handling
export function calculatePercentage(
  x: number,
  y: number,
  width: number,
  height: number
): { xPercent: number; yPercent: number } {
  return {
    xPercent: (x / width) * 100,
    yPercent: (y / height) * 100,
  };
}

// Convert percentage back to pixels
export function percentageToPixels(
  xPercent: number,
  yPercent: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: (xPercent * width) / 100,
    y: (yPercent * height) / 100,
  };
}
