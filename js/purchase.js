document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    // === REFERRAL SOURCE HANDLING ===
    
    // Mapping of URL parameter values to display names
    const referralAliasMap = {
        "ozb": "OzBargain",
        "ob": "OzBargain",
        "reddit": "Reddit",
        "rda": "Reddit",
        "rd": "Reddit",
        "r/ausfinance": " - r/AusFinance",
        "r/fiaustralia": " - r/FIAustralia",
        "r/ukpersonalfinance": " - r/UKPersonalFinance",
        "twitter": "Twitter",
        "facebook": "Facebook",
        "google": "Google",
        "etsy": "Etsy",
        "whirlpool": "Whirlpool",
        "wordofmouth": "Word of Mouth",
        "word-of-mouth": "Word of Mouth",
        "other": "Other"
    };

    // Get source from `ref` parameter first, fallback to `utm_source`
    const sourceValue = params.get("ref") || params.get("utm_source");
    
    if (sourceValue) {
        const sourceSelect = document.getElementById("sheetReferralSourceSelect");
        
        // Validate the select element exists
        if (!sourceSelect) {
            console.warn('sheetReferralSourceSelect element not found');
        } else {
            const rawInput = sourceValue.trim().toLowerCase();
            const mappedValue = referralAliasMap[rawInput];
            let matched = false;

            // First attempt: Try to match using alias mapping
            if (mappedValue) {
                for (const option of sourceSelect.options) {
                    if (option.value.trim().toLowerCase() === mappedValue.toLowerCase()) {
                        sourceSelect.value = option.value;
                        
                        // Special handling for Reddit Ads - store original intent
                        if (rawInput === "rda") {
                            sourceSelect.setAttribute("data-actual-source", "Reddit Ad");
                        } else {
                            sourceSelect.removeAttribute("data-actual-source");
                        }
                        
                        matched = true;
                        break;
                    }
                }
            }

            // Second attempt: Direct case-insensitive match if alias didn't work
            if (!matched) {
                for (const option of sourceSelect.options) {
                    if (option.value.trim().toLowerCase() === rawInput) {
                        sourceSelect.value = option.value;
                        sourceSelect.removeAttribute("data-actual-source");
                        break;
                    }
                }
            }
        }
    }

    // === REGION HANDLING ===
    
    // Mapping of region codes to display names
    const regionMap = {
        AU: "Australia",
        UK: "UK",
        US: "US",
        EU: "EU"
    };

    const regionCode = params.get("region")?.toUpperCase();
    
    if (regionCode && regionMap[regionCode]) {
        const regionSelect = document.getElementById("sheetRegionSelect");
        
        // Validate the select element exists
        if (!regionSelect) {
            console.warn('sheetRegionSelect element not found');
        } else {
            regionSelect.value = regionMap[regionCode];
        }
    }
});