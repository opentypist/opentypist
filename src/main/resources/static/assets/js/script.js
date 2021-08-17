let challengeText = null;
let challengeWords = null;
let characterIndex = 0;


function highlightWordUpTo(characterIndex) {
    let correctText = `<span class="color-correct">` + challengeText.substring(0, characterIndex) + `</span>`
    let restText = challengeText.substring(characterIndex, challengeText.length);
    $('#challenge').html(correctText + restText);
}

function updateWordsPerMinute(startTime, wordsTyped) {
    let millis = new Date().getTime() - startTime;
    let wpm = Math.floor(wordsTyped / (millis / (60 * 1000)));
    $('.stats').text(wpm + " wpm");
}

function setupTyper() {
    let startTime = -1;
    let wordIndex = 0;

    let typer = $('#typer');
    typer.on('input', event => {

        if (startTime == -1)
            startTime = new Date().getTime();

        updateWordsPerMinute(startTime, wordIndex);


        // handle backspace
        if (event.originalEvent.inputType === 'deleteContentBackward') {
            characterIndex--;
        } else {
            characterIndex++;
        }


        // handle a completed word
        if (typer.val().endsWith(" ")) {
            let currentWord = challengeWords[wordIndex];
            if (typer.val().substring(0, typer.val().length - 1) == currentWord) {
                typer.val("");
                wordIndex++;
            }
        }

        // figure out if the word we are typing has an error
        let currentWord = challengeWords[wordIndex];
        $("#debug").text(currentWord);

        if (currentWord == typer.val() && wordIndex == (challengeWords.length - 1)) {
            displayResults();
            return;
        }

        let currentWordHasError = currentWord.substring(0, typer.val().length) != typer.val();
        if (currentWordHasError) {
            typer.addClass("color-incorrect");
        } else {
            typer.removeClass("color-incorrect");
            highlightWordUpTo(characterIndex);
        }
    });
}

function loadQuote() {
    return $.get("api/random", data => {
        data.quote = "test";

        console.log(data.quote);
        challengeText = data.quote;
        $('#challenge').text(challengeText);
        challengeWords = challengeText.split(" ");

        $('#load-container').addClass('d-none');
        $('#typer-container').removeClass('d-none');
    });
}

function displayResults() {
    $('#modal-button').click();
}

$(document).ready(() => {
    loadQuote().done(() => {
        setupTyper();
    });

    $("#retry-button").on("click", evt => {
        $('#load-container').removeClass('d-none');
        $('#typer-container').addClass('d-none');

        characterIndex = 0;

        loadQuote();
    });
});
