let quote = null;
let challengeText = null;
let challengeWords = null;
let characterIndex = 0;
let startTime = -1;
let wordIndex = 0;

let canRetry = false;

let wpm = 0;
let wpmIntervalHandler = null;

// Register key listener for whole page ('enter') to retry
$(document).keypress( (e) => {
    if(e.which == 13 && canRetry) {
        retry();
    }
});

function displayLocalHighscore() {
    let highscore = Cookies.get('local-highscore');
    console.log('highscore=' + highscore);
    if (highscore != undefined) {
        $('#local-highscore').text(highscore);
        $('#local-highscore-container').removeClass('d-none');
    }
}

function updateLocalHighscore(wpm) {
    let highscore = Cookies.get('local-highscore');
    if (highscore == undefined || wpm > highscore) {
        Cookies.set('local-highscore', wpm);
    }
}

function highlightWordUpTo(characterIndex) {
    let correctText = `<span class="color-correct">` + challengeText.substring(0, characterIndex) + `</span>`
    let restText = challengeText.substring(characterIndex, challengeText.length);
    $('#challenge').html(correctText + restText);
}

function updateWordsPerMinute() {
    let millis = new Date().getTime() - startTime;
    // Average of 5 characters per word
    let wordsTyped = characterIndex / 5;
    let timePassed = millis / (60 * 1000);
    if(timePassed > 0)
        wpm = Math.floor(wordsTyped / (millis / (60 * 1000)));
    $('#stats').text(wpm + " wpm");
}

function setupTyper() {
    let typer = $('#typer');
    typer.on('input', event => {

        if (startTime == -1)
            startTime = new Date().getTime();

        // Start wpm interval to update every 100ms
        if(wpmIntervalHandler == null)
            wpmIntervalHandler = window.setInterval(updateWordsPerMinute, 100);

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
        let quoteCompleted = currentWord == typer.val() && wordIndex == (challengeWords.length - 1);
        let currentWordHasError = quoteCompleted ? false : currentWord.substring(0, typer.val().length) != typer.val();
        if (currentWordHasError) {
            typer.addClass("color-incorrect");
        } else {
            typer.removeClass("color-incorrect");
            highlightWordUpTo(characterIndex);
        }

        if (quoteCompleted)
            displayResults(wpm);
    });
}

function loadQuote() {
    return $.get("api/random", data => {
        console.log(data);
        quote = data;
        challengeText = data.quote;
        $('#challenge').text(challengeText);
        challengeWords = challengeText.split(" ");

        $('#load-container').addClass('d-none');
        $('#typer-container').removeClass('d-none');
        $('#typer').focus();
    });
}

async function copyToClipboard(textToCopy) {
    try {
        // 1) Copy text
        await navigator.clipboard.writeText(textToCopy);

        // 2) Catch errors
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

function displayResults(typingSpeed) {

    clearInterval(wpmIntervalHandler);

    $('#typer').val("");
    $('#typer').prop("disabled", true);
    $('#retry-container').toggle(1200, function() {
        canRetry = true;
    });
    $('#challenge').fadeTo(1200, 0.2);

    $.post("/post-result?speed=" + typingSpeed + "&quoteId=" + quote.id, result => {
        let id = result.id;
        let address = window.location.origin + "/result?id=" + id;
        $('#result_url').val(address);
    });

    updateLocalHighscore(typingSpeed);
    displayLocalHighscore();
}

function retry() {
    canRetry = false;

    $('#load-container').removeClass('d-none');
    $('#typer-container').addClass('d-none');

    startTime = -1;
    characterIndex = 0;
    wordIndex = 0;
    wpm = 0;
    wpmIntervalHandler = null;

    loadQuote();

    $('#stats').text("0 wpm");
    $('#retry-container').toggle();
    $('#challenge').fadeTo(0, 1.0);
    $('#typer').prop("disabled", false);
}

$(document).ready(() => {

    displayLocalHighscore();

    loadQuote().done(() => {
        setupTyper();
    });

    $("#retry").on("click", evt => {
        retry();
    });

    $("#copy-button").on("click", evt => {
        copyToClipboard($('#result_url').val());
    })
});
