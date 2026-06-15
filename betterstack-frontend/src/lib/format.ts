/**
 * Small presentation-only formatting helpers shared across pages.
 */

/**
 * Reduce a full URL to just its host for display (e.g.
 * "https://sketch--me.vercel.app/path" → "sketch--me.vercel.app").
 *
 * Falls back to a regex strip of the scheme/trailing slash if the string isn't
 * a parseable URL, so it never throws on malformed input.
 */
export function prettyHost(url: string): string {
    try {
        return new URL(url).host;
    } catch {
        return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
}
