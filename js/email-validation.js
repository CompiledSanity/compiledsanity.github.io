// Select the specific input element with ID 'sheetEmailInput'
const inputElement = document.getElementById('sheetEmailInput');

// Array of words to check for
const wordsToCheck = ['spam'];

// Function to check input value and show warning
function checkForForbiddenWords(event) {
    const inputValue = event.target.value.trim();

    // Find any matching words
    const foundWords = wordsToCheck.filter(word =>
        inputValue.toLowerCase().includes(word.toLowerCase())
    );

    if (foundWords.length > 0) {
        // Create warning element if it doesn't exist
        let warningElement = document.getElementById('word-warning');

        if (!warningElement) {
            warningElement = document.createElement('div');
            warningElement.id = 'word-warning';
            warningElement.className = 'alert alert-warning mt-1';

            // Insert the warning after the input
            event.target.parentNode.insertBefore(warningElement, event.target.nextSibling);
        }

        // Create the warning message with the detected words
        if (foundWords.length === 1) {
            warningElement.innerHTML = `<b>Please note:</b> The word '${foundWords[0]}' in this address may cause issues with email deliverability, or not be delivered at all. This is a restriction by our mailer. For best results, try an alternative address.`;
          } else {
            const lastWord = foundWords.pop();
            const wordsList = foundWords.join("', '");
            warningElement.innerHTML = `<b>Please note:</b> The words '${wordsList}' and '${lastWord}' in this address may cause issues with email deliverability, or not be delivered at all. This is a restriction by our mailer. For best results, try an alternative address.`;
          }
    } else {
        // Remove warning if it exists and input doesn't contain any forbidden words
        const warningElement = document.getElementById('word-warning');
        if (warningElement) {
            warningElement.remove();
        }
    }
}

// Add the blur event listener to the specific input
if (inputElement) {
    // 'blur' event fires when element loses focus (user moves to something else)
    inputElement.addEventListener('blur', checkForForbiddenWords);
} else {
    console.error("Could not find input element with ID 'sheetEmailInput'");
}