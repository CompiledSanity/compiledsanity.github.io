// Set the originalReferrer cookie if it doesn't already exist
function setOriginalReferrerCookie(expiryDays = 30) {
    if (!getCookie('originalReferrer')) {
        const referrer = document.referrer || 'direct';
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

// Expose functions to global window object
window.setOriginalReferrerCookie = setOriginalReferrerCookie;
window.getOriginalReferrerCookie = getOriginalReferrerCookie;