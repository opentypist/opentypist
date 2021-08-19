let challengeText = null;
let challengeWords = null;
let characterIndex = 0;
let startTime = -1;
let wordIndex = 0;

function highlightWordUpTo(characterIndex) {
    let correctText = `<span class="color-correct">` + challengeText.substring(0, characterIndex) + `</span>`
    let restText = challengeText.substring(characterIndex, challengeText.length);
    $('#challenge').html(correctText + restText);
}

function updateWordsPerMinute(startTime, wordsTyped) {
    let millis = new Date().getTime() - startTime;
    let wpm = Math.floor(wordsTyped / (millis / (60 * 1000)));
    $('#stats').text(wpm + " wpm");
    return wpm;
}

function setupTyper() {
    let typer = $('#typer');
    typer.on('input', event => {

        if (startTime == -1)
            startTime = new Date().getTime();

        let typingSpeed = updateWordsPerMinute(startTime, wordIndex);

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
            displayResults(typingSpeed);
    });
}

function loadQuote() {
    return $.get("api/random", data => {

        console.log(data.quote);
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
    $('#typer').val("");
    $('#typer').prop("disabled", true);
    $('#retry-container').toggle(1200);
    $('#challenge').fadeTo(1200, 0.2);

    $.post("/post-result?speed=" + typingSpeed, result => {
        console.log(result);
        let id = result.id;
        let address = window.location.origin + "/result?id=" + id;
        $('#result_url').val(address);
    });
}

$(document).ready(() => {

    loadQuote().done(() => {
        setupTyper();
    });

    $("#retry").on("click", evt => {
        $('#load-container').removeClass('d-none');
        $('#typer-container').addClass('d-none');

        startTime = -1;
        characterIndex = 0;
        wordIndex = 0;

        loadQuote();

        $('#retry-container').toggle();
        $('#challenge').fadeTo(0, 1.0);
        $('#typer').prop("disabled", false);
    });

    $("#copy-button").on("click", evt => {
        copyToClipboard($('#result_url').val());
    })
});
