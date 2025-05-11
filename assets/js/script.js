// Sample texts for different difficulty levels
const typingTexts = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "All good things come to those who wait.",
        "Practice makes perfect.",
        "Early bird catches the worm.",
        "Look before you leap."
    ],
    medium: [
        "The five boxing wizards jump quickly. A quick movement of the enemy will jeopardize five gunboats.",
        "We promptly judged antique ivory buckles for the next prize. How razorback-jumping frogs can level six piqued gymnasts!",
        "Whenever the black fox jumped, the squirrel gazed suspiciously. The job requires extra pluck and zeal from every young wage earner.",
        "I quickly explained that many big jobs involve few hazards. The explorer was frozen in his big kayak just after making queer discoveries."
    ],
    hard: [
        "Jaded zombies acted quaintly but kept driving their oxen forward. The job requires extra pluck and zeal from every young wage earner.",
        "Six big devils from Japan quickly forgot how to waltz. The explorer was frozen in his big kayak just after making queer discoveries.",
        "My grandfather picks up quartz and valuable onyx jewels. Crazy Fredrick bought many very exquisite opal jewels.",
        "The wizard quickly jinxed the gnomes before they vaporized. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!"
    ]
};

// DOM elements
const difficultySelect = document.getElementById('inputGroupSelect01');
const sampleTextElement = document.getElementById('sample-text');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const retryButton = document.getElementById('retry-btn');
const typingInput = document.getElementById('typing-input');
const resultLevel = document.getElementById('result-level');
const resultTime = document.getElementById('result-time');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
// Instructions Modal Functionality
const instructionButton = document.getElementById('instruction');

// Variables to track test state
let startTime;
let timerInterval;
let selectedDifficulty;
let currentText;

// Get random text based on difficulty
function getRandomText(difficulty) {
    // Default to easy if difficulty is not recognized
    const level = typingTexts[difficulty] ? difficulty : 'easy';
    const textArray = typingTexts[level];
    const randomIndex = Math.floor(Math.random() * textArray.length);
    return textArray[randomIndex];
}

// Update the sample text based on selected difficulty
function updateSampleText() {
    const selectedIndex = difficultySelect.selectedIndex;
    
    if (selectedIndex === 0) {
        // "Choose..." option is selected
        sampleTextElement.textContent = "Please select a difficulty level to begin.";
        startButton.disabled = true;
        return;
    }
    
    // Map option values to difficulty levels
    const difficultyMap = {
        '1': 'easy',
        '2': 'medium',
        '3': 'hard'
    };
    
    selectedDifficulty = difficultyMap[difficultySelect.value];
    currentText = getRandomText(selectedDifficulty);
    sampleTextElement.textContent = currentText;
    startButton.disabled = false;
    
    // Display selected difficulty in the results panel
    resultLevel.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
}

//  Function to provide real-time feedback
function provideFeedback() {
    const typedText = typingInput.value;
    let highlightedText = '';
    
    // Process each character for highlighting
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            // Character has been typed
            if (typedText[i] === currentText[i]) {
                // Correct character - blue
                highlightedText += `<span class="correct-char">${currentText[i]}</span>`;
            } else {
                // Incorrect character - red
                highlightedText += `<span class="incorrect-char">${currentText[i]}</span>`;
            }
        } else {
            // Character not yet typed - normal
            highlightedText += currentText[i];
        }
    }
    
    // Update the sample text with highlighted version
    sampleTextElement.innerHTML = highlightedText;
    
    // Calculate and update real-time accuracy
    if (typedText.length > 0) {
        let correctChars = 0;
        const minLength = Math.min(typedText.length, currentText.length);
        
        for (let i = 0; i < minLength; i++) {
            if (typedText[i] === currentText[i]) {
                correctChars++;
            }
        }
        
        const accuracy = Math.round((correctChars / typedText.length) * 100);
        resultAccuracy.textContent = accuracy + '%';
    }
}

// Start the typing test
function startTest() {
    // Reset results
    resultTime.textContent = '0s';
    resultWpm.textContent = '0';
    resultAccuracy.textContent = '0%';
    
    // Enable input, disable appropriate buttons
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
    startButton.disabled = true;
    stopButton.disabled = false;
    retryButton.disabled = true;
    difficultySelect.disabled = true;

    // Add event listener for real-time feedback
    typingInput.addEventListener('input', provideFeedback);

    // Start the timer
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer display
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    resultTime.textContent = elapsedTime + 's';
}

// Stop the typing test
function stopTest() {
    clearInterval(timerInterval);

    // Remove the input event listener
    typingInput.removeEventListener('input', provideFeedback);

    
    // Calculate results
    const endTime = new Date();
    const elapsedTimeSec = (endTime - startTime) / 1000;
    const typedText = typingInput.value.trim();
    const wordsTyped = typedText.split(/\s+/).length;
    const wpm = Math.round((wordsTyped / elapsedTimeSec) * 60);
    
    // Calculate accuracy (simple character-based comparison)
    let correctChars = 0;
    const minLength = Math.min(typedText.length, currentText.length);
    
    for (let i = 0; i < minLength; i++) {
        if (typedText[i] === currentText[i]) {
            correctChars++;
        }
    }
    
    const accuracy = Math.round((correctChars / currentText.length) * 100);
    
    // Update results
    resultWpm.textContent = wpm;
    resultAccuracy.textContent = accuracy + '%';
    
    // Disable/enable appropriate buttons
    typingInput.disabled = true;
    stopButton.disabled = true;
    retryButton.disabled = false;
    difficultySelect.disabled = false;
}

// Reset the test
function retryTest() {
    updateSampleText();
    typingInput.value = '';
    startButton.disabled = false;
    retryButton.disabled = true;
}

// Event listeners
difficultySelect.addEventListener('change', updateSampleText);
startButton.addEventListener('click', startTest);
stopButton.addEventListener('click', stopTest);
retryButton.addEventListener('click', retryTest);
// Add event listener to the instruction button
instructionButton.addEventListener('click', function() {
    // Use Bootstrap's Modal API to show the modal
    const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));
    instructionsModal.show();
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Create modal elements
    const modalHTML = `
    <div class="modal fade" id="instructionsModal" tabindex="-1" aria-labelledby="instructionsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="instructionsModalLabel">How to Use Type Racer</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6 class="mb-3">Follow these steps to test your typing speed:</h6>
                    <ol class="list-group list-group-numbered mb-3">
                        <li class="list-group-item">Select a difficulty level from the dropdown menu (Easy, Medium, or Hard)</li>
                        <li class="list-group-item">Click the "Start Test" button to begin the timer</li>
                        <li class="list-group-item">Type the displayed text in the input area as accurately and quickly as possible</li>
                        <li class="list-group-item">The text will highlight in blue (correct) or red (incorrect) as you type</li>
                        <li class="list-group-item">Click "Stop Test" when you've finished typing</li>
                        <li class="list-group-item">View your results including WPM (Words Per Minute) and accuracy</li>
                        <li class="list-group-item">Click "Retry" to try again with a new text sample</li>
                    </ol>
                    <p class="alert alert-info">
                        <strong>Tip:</strong> Focus on accuracy first, then work on improving your speed. Regular practice will help you become a faster typist!
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Add modal to the document
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    // Set initial state
    typingInput.disabled = true;
    stopButton.disabled = true;
    retryButton.disabled = true;
    startButton.disabled = true;
    
    sampleTextElement.textContent = "Please select a difficulty level to begin.";
});