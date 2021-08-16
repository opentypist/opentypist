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

        console.log(e.originalEvent.inputType === "deleteContentBackward");
        console.log('Letter??? ' + e.originalEvent.data);

        let typedChar = e.originalEvent.data;

        let backspace = e.originalEvent.inputType === "deleteContentBackward" ? true : false;
        console.log("Got backspace: " + backspace);

        if(backspace) {
            charTyped--;
            charIndex--;
        }

        if(typedChar === challengeText.charAt(charIndex) || backspace) {

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
    
        } else if(e.originalEvent.inputType === "deleteContentBackward") { // Pressing backspace
            console.log("removing character");

            // Wait to update colors until all random shit is removed

            // Compare input text to word, then update charTyped

            // if incorrectTyped character then charTyped + 1



            // typer.val() // input value

            // challengeWords[numWordsTyped] //

            // Text should be updated to only show green up to charTyped

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