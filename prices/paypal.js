function initPayPalButton() {
    paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        enableFunding: [paypal.FUNDING.APPLEPAY],

        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
        },

        onClick: function (data, actions) {
            // Enable or disable the button when it has a value
            const emailWarning = document.getElementById('emailWarning');
            const sheetEmailInput = document.getElementById('sheetEmailInput');

            if (sheetEmailInput.checkValidity() &&
                sheetEmailInput.value != "" &&
                sheetEmailInput.value.includes("@") &&
                sheetEmailInput.value.includes(".") &&
                !sheetEmailInput.value.endsWith(".cm") &&
                !sheetEmailInput.value.endsWith("gmal.com") &&
                !sheetEmailInput.value.endsWith("gmaill.com") &&
                !sheetEmailInput.value.endsWith("gmail.com.au")) {
                emailWarning.style.display = "none";
            } else {
                emailWarning.style.display = "block";
                sheetEmailInput.reportValidity();
            }
        },

        onInit: function (data, actions) {
            // Disable the buttons
            actions.disable();

            // Listen for changes..
            document.querySelector('#sheetEmailInput')
                .addEventListener('change', function (event) {

                    // Enable or disable the button when it has a value
                    const emailWarning = document.getElementById('emailWarning');

                    if (event.target.checkValidity() &&
                        event.target.value != "" &&
                        event.target.value.includes("@") &&
                        event.target.value.includes(".") &&
                        !event.target.value.endsWith(".cm") &&
                        !event.target.value.endsWith("gmal.com") &&
                        !event.target.value.endsWith("gmaill.com") &&
                        !event.target.value.endsWith("gmail.com.au")) {
                        actions.enable();
                        emailWarning.style.display = "none";
                    } else {
                        actions.disable();
                        emailWarning.style.display = "block";
                        event.target.reportValidity();
                    }
                });
        },

        createOrder: function (data, actions) {
            const user_email = document.getElementById('sheetEmailInput').value;
            const sheet_region = document.getElementById('sheetRegionSelect').value;
            const referral_source = getActualReferralSource();
            const sp = parseFloat(document.getElementById('audtotalprice').textContent); // This is checked Server side, so change at your own peril ;)

            return actions.order.create({
                purchase_units: [{
                    "description": "CompiledSanity Personal Savings Template",
                    "reference_id": user_email,
                    "custom_id": referral_source,
                    "items": [{
                        "name": "CompiledSanity Personal Savings Template",
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": "AUD",
                            "value": sp, // This is checked Server side, so change at your own peril ;)
                        },
                        "category": "DIGITAL_GOODS",
                        "sku": sheet_region
                    }],
                    "amount": {
                        "currency_code": "AUD",
                        "value": sp,
                        "breakdown": {
                            "item_total": {
                                "currency_code": "AUD",
                                "value": sp, // This is checked Server side, so change at your own peril ;)
                            }
                        }
                    }
                }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {

                // Full available details
                // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

                // Show a success message within this page, e.g.
                // const element = document.getElementById('paypal-button-container');
                //element.innerHTML = '';
                //element.innerHTML = '<h3>Thank you for your payment!</h3>';

                window.location.href = "https://cspersonalfinance.io/success";
            });
        },

        onError: function (err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}

function getActualReferralSource() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const utmSourceRawInput = params.get("utm_source");
    const refRawInput = params.get("ref");

    // Get the select element and validate it exists
    const sheetReferralSourceSelect = document.getElementById('sheetReferralSourceSelect');

    if (!sheetReferralSourceSelect) {
        console.warn('sheetReferralSourceSelect element not found');
        return null;
    }

    const sheetReferralSourceSelectValue = sheetReferralSourceSelect.value.trim();

    // Check for utm_source first, then ref
    const rawSourceInput = utmSourceRawInput || refRawInput;

    // If no query parameters, return just the select value
    if (!rawSourceInput) {
        console.log('No utm_source or ref parameter found, returning select value only');
        return sheetReferralSourceSelectValue;
    }

    // Normalize the source value
    const sourceValue = rawSourceInput.trim().toLowerCase();

    console.log('Found source parameter:', sourceValue);
    console.log('Select value:', sheetReferralSourceSelectValue);

    // Handle specific source values
    switch (sourceValue) {
        case "rda":
            return `Reddit Ad (${sheetReferralSourceSelectValue})`;
        case "facebook":
            return `Facebook (${sheetReferralSourceSelectValue})`;
        case "google":
            return `Google (${sheetReferralSourceSelectValue})`;
        case "twitter":
            return `Twitter (${sheetReferralSourceSelectValue})`;
        default:
            // For any other utm_source/ref value, combine it with the select value
            return `${rawSourceInput} (${sheetReferralSourceSelectValue})`;
    }
}

function debugReferralSource() {
    const params = new URLSearchParams(window.location.search);
    console.log('Current URL:', window.location.href);
    console.log('utm_source:', params.get("utm_source"));
    console.log('ref:', params.get("ref"));

    const selectElement = document.getElementById('sheetReferralSourceSelect');
    console.log('Select element found:', !!selectElement);
    console.log('Select value:', selectElement ? selectElement.value : 'N/A');

    const result = getActualReferralSource();
    console.log('Final result:', result);

    return result;
}

initPayPalButton();
debugReferralSource();