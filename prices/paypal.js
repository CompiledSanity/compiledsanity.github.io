function initPayPalButton() {
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
        },

        onClick: function (data, actions) {
            // Enable or disable the button when it has a value
            emailWarning = document.getElementById('emailWarning');
            sheetEmailInput = document.getElementById('sheetEmailInput');

            if (sheetEmailInput.checkValidity() && sheetEmailInput.value != "" && sheetEmailInput.value.includes("@") && sheetEmailInput.value.includes(".")) {
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
                    emailWarning = document.getElementById('emailWarning');

                    if (event.target.checkValidity() && event.target.value != "" && event.target.value.includes("@") && event.target.value.includes(".")) {
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
            user_email = document.getElementById('sheetEmailInput').value;
            sheet_region = document.getElementById('sheetRegionSelect').value;
            referral_source = document.getElementById('sheetReferralSourceSelect').value;
            sp = parseFloat(document.getElementById('audtotalprice').textContent); // This is checked Server side, so change at your own peril ;)

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
initPayPalButton();
