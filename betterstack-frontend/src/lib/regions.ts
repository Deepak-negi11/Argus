/**
 * Region identifiers and how they are displayed in the UI.
 *
 * Worker nodes report a `region_id` (e.g. "india-mumbai", "us-san-francisco").
 * These ids are not pretty, vary between environments, and have historical
 * aliases, so the UI maps them to short human labels ("India", "SF") and to a
 * consistent line color on the comparison chart.
 *
 * Consolidated from the dashboard and website-detail pages, which each carried
 * their own (and diverging) copies of this mapping.
 */

/** Known region id → short display label. */
export const REGION_LABELS: Record<string, string> = {
    blr: 'BLR',
    'worker-blr': 'BLR',
    'banglore-1': 'BLR',
    'bangalore-1': 'BLR',
    'india-mumbai': 'India',
    'india-1': 'India',
    sf: 'SF',
    sfo: 'SF',
    'worker-sf': 'SF',
    'worker-sfo': 'SF',
    'san-francisco': 'SF',
    'us-san-francisco': 'SF',
    'us-west-1': 'SF',
};

/** Fallback palette for regions that don't have a hard-coded color. */
export const FALLBACK_REGION_COLORS = ['#0872F0', '#22D3EE', '#F472B6', '#34D399'];

/** Turn a raw region id into its short display label, falling back to the id. */
export function labelRegion(regionId: string): string {
    return REGION_LABELS[regionId] || regionId;
}

/**
 * Pick a stable chart color for a region.
 *
 * SF-family regions are amber, India/BLR-family are light blue; anything else
 * cycles through {@link FALLBACK_REGION_COLORS} by index so multiple unknown
 * regions still get distinct colors.
 */
export function regionColor(regionId: string, index: number): string {
    const normalized = regionId.toLowerCase();
    if (normalized.includes('sfo') || normalized.includes('sf') || normalized.includes('san-francisco')) {
        return '#E8AB3A';
    }
    if (
        normalized.includes('blr')
        || normalized.includes('bangalore')
        || normalized.includes('banglore')
        || normalized.includes('india')
        || normalized.includes('mumbai')
    ) {
        return '#8CC4F1';
    }
    return FALLBACK_REGION_COLORS[index % FALLBACK_REGION_COLORS.length];
}
