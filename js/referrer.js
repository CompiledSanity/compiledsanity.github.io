// Set the originalReferrer cookie if it doesn't already exist
function setOriginalReferrerCookie(expiryDays = 30) {
    const referrer = getReferrerFullDomain() || 'direct';
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

// Helper: Get the base domain of the referrer
function getReferrerFullDomain() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';

    try {
        const url = new URL(referrer);
        let hostname = url.hostname.toLowerCase();
        if (hostname.startsWith('www.')) {
            hostname = hostname.slice(4); // remove 'www.'
        }
        return hostname.slice(0, 30); // Limit to 30 characters
    } catch {
        return 'direct';
    }
}

// Expose functions to global window object
window.setOriginalReferrerCookie = setOriginalReferrerCookie;
window.getOriginalReferrerCookie = getOriginalReferrerCookie;
