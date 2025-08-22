// normalizeForUrl.js

export function normalizeForUrl(text:string) {
  if (typeof text !== 'string') {
    return '';
  }
    // Convert to lowercase
    let normalizedText = text.toLowerCase();
  
    // Replace spaces and special characters with hyphens
    normalizedText = normalizedText.replace(/[\s\W-]+/g, '-');
  
    // Remove any leading or trailing hyphens
    normalizedText = normalizedText.replace(/^-+|-+$/g, '');
  
    // Encode the normalized text to ensure it is URL-safe
    return encodeURIComponent(normalizedText);
  }