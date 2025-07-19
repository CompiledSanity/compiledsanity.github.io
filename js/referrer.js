// Set the originalReferrer cookie if it doesn't already exist
function setOriginalReferrerCookie(expiryDays = 30) {
    if (!getCookie('originalReferrer')) {
        const referrer = getReferrerBaseDomain() || 'direct';
        const maxAgeSeconds = expiryDays * 24 * 60 * 60;
        document.cookie = `originalReferrer=${encodeURIComponent(referrer)}; path=/; max-age=${maxAgeSeconds}`;
        console.log('Original referrer cookie set:', referrer);
    }
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

// Extract the base domain (domain + extension) from a hostname
function getBaseDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length <= 2) {
        return hostname; // e.g. example.com or localhost
    } else {
        return parts.slice(-2).join('.'); // e.g. www.reddit.com -> reddit.com
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
