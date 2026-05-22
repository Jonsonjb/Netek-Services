/**
 * Utilities for extracting and formatting user names from Firebase Authentication user objects.
 * Facilitates custom user greetings.
 */

export const getUserFriendlyName = (user: any): string => {
  if (!user) return "";
  
  // 1. Prioritize Google/Firebase auth standard displayName (often present for Google users)
  if (user.displayName && user.displayName.trim()) {
    const dName = user.displayName.trim();
    return dName
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // 2. Fallback: Parse the local email prefix to extract a human name (e.g. paulo.silva@gmail.com -> Paulo Silva)
  if (user.email && user.email.trim()) {
    const email = user.email.trim();
    if (email === "admin@jonsonjb.com") return "Admin Jonson JB";

    const prefix = email.split("@")[0];
    // Split on common email dividers: dot, dash, underscore, and numeric digits
    const parts = prefix.split(/[._\-\d]+/);
    const cleanParts = parts.filter(p => p.trim().length > 0);
    
    if (cleanParts.length > 0) {
      // Return up to two name parts (e.g., "Paulo Silva" from "paulo.silva") capitalized nicely
      return cleanParts
        .slice(0, 2)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
    }
    return prefix;
  }

  return "Utilizador Netek";
};
