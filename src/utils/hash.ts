export function generateHash(text: string): string {
  let hash = 2166136261; // FNV-1a 32-bit offset basis

  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    // Bitwise multiplication keeps it fast and fits within 32-bit integer limits
    hash = Math.imul(hash, 16777619);
  }

  // Convert to an unsigned hex string for a clean text key
  return (hash >>> 0).toString(16);
}
