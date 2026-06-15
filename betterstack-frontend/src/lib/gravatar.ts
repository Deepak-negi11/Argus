/**
 * Build a Gravatar avatar URL for an email address.
 *
 * Gravatar identifies users by the SHA-256 hash of their lowercased, trimmed
 * email. `?d=404` makes Gravatar return a 404 (instead of a placeholder image)
 * when the user has no avatar, so callers can detect "no avatar" and fall back
 * to their own initials/placeholder.
 *
 * Extracted from settings, dashboard-sidebar, and top-nav, which previously
 * each carried an identical copy.
 */
export async function getGravatarUrl(email: string): Promise<string> {
    const cleaned = email.trim().toLowerCase();
    const msgBuffer = new TextEncoder().encode(cleaned);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return `https://www.gravatar.com/avatar/${hashHex}?d=404`;
}
