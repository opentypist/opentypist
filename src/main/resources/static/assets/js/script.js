let challengeText = null;
let avgWordSize = 5; // Can change to adjust wpm
let charIndex = 0;
let charTyped = 0;
let startTime = -1;
let typer = null;
let incorrectTyped = false;
let numWordsTyped = 0;
let challengeWords = null;

$(document).ready(() => {
    typer = $('#typer');

    $.get("api/random", data => {
        console.log(data.quote);
        challengeText = data.quote;
        $('#challenge').text(challengeText);
        challengeWords = challengeText.split(" ");
        
        setupTyper();
    });
});

let wpmInterval = setInterval(updateWordsPerMinute, 1000);

function updateWordsPerMinute() {
    if(startTime === -1)
        return
    let millis = new Date().getTime() - startTime;
    let wpm = Math.floor(charTyped / (avgWordSize * (millis / (60 * 1000))));
    setWPM(wpm);
}

function setWPM(wpm) {
    $('#stats').text(wpm + " wpm");
}

function setupTyper() {

    /*
    typer.keypress( function(e) {

        if (startTime === -1) {
            startTime = new Date().getTime();
            console.log("Start time set!");
        }
    
        if ((charTyped + 1) === challengeText.length) {
            clearInterval(wpmInterval);
            updateWordsPerMinute(); // One last time to reflect final score
        }
    
        let typedChar = String.fromCharCode(e.which);

        if(typedChar === challengeText.charAt(charIndex)) {

            console.log('typed correctly: ' + typedChar);
    
            let challengeElement = $('#challenge');
            let frontSpan = '<span class="color-correct">';
            let correctText = challengeText.substring(0, charIndex + 1);
            let backSpan = '</span>';
            let remainingText = challengeText.substring(charIndex + 1);
    
            let totalString = frontSpan + correctText + backSpan + remainingText;
    
            console.log('Typer val: ' + typer.val() + typedChar);
            // console.log('Pure Javascript: ' + document.getElementById("typer").value);
            console.log('Typer val length: ' + typer.val().length);
            console.log('Challenge word compared: ' + challengeWords[numWordsTyped].substring(0, typer.val().length + 1));

            if((typer.val() + typedChar) === challengeWords[numWordsTyped].substring(0, typer.val().length + 1) 
                || (typer.val() + typedChar) === (challengeWords[numWordsTyped].substring(0, typer.val().length + 1) + ' ')) { // only update correct letters if no extra characters in between
                challengeElement.html(totalString);

                if(typedChar === ' ') {
                    typer.val("");
                    numWordsTyped++;
                }
    
                charIndex++;
                charTyped++;
            }
    
        } else {
            // Incorrect char, add red coloring to it.
            incorrectTyped = true;

            let challengeElement = $('#challenge');
            let frontSpan = '<span class="color-correct">';
            let correctText = challengeText.substring(0, charIndex);
            let backSpan = '</span>';
            let frontWrongSpan = '<span class="color-incorrect">';
            let wrongLetter = challengeText.charAt(charIndex);
            let backWrongSpan = '</span>';
            let remainingText = challengeText.substring(charIndex + 1);
    
            let totalString = frontSpan + correctText + backSpan + frontWrongSpan + wrongLetter + backWrongSpan + remainingText;

            challengeElement.html(totalString);
        }
    
    });
    */
    console.log("Now using 'input' :)");
    typer.on('input', function(e) {

        if (startTime === -1) {
            startTime = new Date().getTime();
            console.log("Start time set!");
        }
    
        if ((charTyped + 1) === challengeText.length) {
            clearInterval(wpmInterval);
            updateWordsPerMinute(); // One last time to reflect final score
        }
    
        console.log('Letter??? ' + e.originalEvent.data);

        let typedChar = e.originalEvent.data;

        if(typedChar === challengeText.charAt(charIndex)) {

            console.log('typed correctly: ' + typedChar);
    
            let challengeElement = $('#challenge');
            let frontSpan = '<span class="color-correct">';
            let correctText = challengeText.substring(0, charIndex + 1);
            let backSpan = '</span>';
            let remainingText = challengeText.substring(charIndex + 1);
    
            let totalString = frontSpan + correctText + backSpan + remainingText;
    
            console.log('Typer val: ' + typer.val());
            // console.log('Pure Javascript: ' + document.getElementById("typer").value);
            console.log('Typer val length: ' + typer.val().length);
            console.log('Challenge word compared: ' + challengeWords[numWordsTyped].substring(0, typer.val().length));

            if(typer.val() === challengeWords[numWordsTyped].substring(0, typer.val().length) 
                || typer.val() === (challengeWords[numWordsTyped].substring(0, typer.val().length) + ' ')) { // only update correct letters if no extra characters in between
                    
                challengeElement.html(totalString);

                if(typedChar === ' ') {
                    typer.val("");
                    numWordsTyped++;
                }
    
                charIndex++;
                charTyped++;

                console.log("Char typed: " + charTyped + " ChallengeText Length: " + challengeText.length);

                if(charTyped === challengeText.length) {
                    typer.val("");
                }
            }
    
        } else {
            // Incorrect char, add red coloring to it.
            incorrectTyped = true;

            let challengeElement = $('#challenge');
            let frontSpan = '<span class="color-correct">';
            let correctText = challengeText.substring(0, charIndex);
            let backSpan = '</span>';
            let frontWrongSpan = '<span class="color-incorrect">';
            let wrongLetter = challengeText.charAt(charIndex);
            let backWrongSpan = '</span>';
            let remainingText = challengeText.substring(charIndex + 1);
    
            let totalString = frontSpan + correctText + backSpan + frontWrongSpan + wrongLetter + backWrongSpan + remainingText;

            challengeElement.html(totalString);
        }

    });

    // Should switch to using this because it has access to the actual value in the input field after reciving the key event (not missing current key)
    /*
    typer.on('input', function(e) {
        console.log(e);
        console.log();
        console.log('Input - Typer val: ' + typer.val());
        console.log('Input - Pure Javascript: ' + document.getElementById("typer").value);
        console.log('Input - Challenge word compared: ' + challengeWords[numWordsTyped].substring(0, typer.val().length));
    });
    */

    /*
    typer.keyup( function(e) {
        if(charTyped === challengeText.length) { // Removes the last word without pressing space
            console.log("removed last word");
            numWordsTyped++;
            typer.val("");
        }
    });
    */

    $('#load-container').addClass('d-none'); // Remove loading spinner
    $('#typer-container').removeClass('d-none'); // Load Text box and input field

    $('#typer').focus(); // Request focus to input
}