// Set the originalReferrer cookie if it doesn't already exist
function setOriginalReferrerCookie(expiryDays = 30) {
    const referrer = getReferrerBaseDomain() || 'direct';
    const maxAgeSeconds = expiryDays * 24 * 60 * 60;
    document.cookie = `originalReferrer=${encodeURIComponent(referrer)}; path=/; max-age=${maxAgeSeconds}`;
    console.log('Original referrer cookie set:', referrer);
}

// Get the originalReferrer cookie value (or 'direct' if not set)
function getOriginalReferrerCookie() {
    const cookieValue = getCookie('originalReferrer');
    console.log('cookieValue:', cookieValue);
    return cookieValue || 'direct';
}

// Helper: Read a cookie by name
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

// List of common multi-part TLDs to consider (extend as needed)
const multiPartTLDs = [
    'com.au',
    'co.uk',
    'gov.uk',
    'ac.uk',
    'com.br',
    'net.au',
    'org.uk',
    'co.nz',
    'org.nz'
];

// Extract the base domain (domain + extension), considering multi-part TLDs
function getBaseDomain(hostname) {
    const parts = hostname.toLowerCase().split('.');

    if (parts.length <= 2) {
        // e.g., example.com or localhost
        return hostname.toLowerCase();
    }

    // Check if the last two parts form a known multi-part TLD
    const lastTwoParts = parts.slice(-2).join('.');
    const lastThreeParts = parts.slice(-3).join('.');

    if (multiPartTLDs.includes(lastTwoParts)) {
        // domain is 3 parts: e.g. google.com.au
        return parts.slice(-3).join('.');
    } else if (multiPartTLDs.includes(lastThreeParts)) {
        // rare case for longer TLDs
        return lastThreeParts;
    } else {
        // Default to last two parts: example.com
        return lastTwoParts;
    }
}

// Get the referrer's base domain or 'direct' if unavailable/invalid
function getReferrerBaseDomain() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';

    try {
        const url = new URL(referrer);
        return getBaseDomain(url.hostname);
    } catch {
        return 'direct';
    }
}

// Expose functions to global window object
window.setOriginalReferrerCookie = setOriginalReferrerCookie;
window.getOriginalReferrerCookie = getOriginalReferrerCookie;
