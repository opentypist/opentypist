let challengeText = "If you feel like there's something out there that you're supposed to be doing, if you have a passion for it, then stop wishing and just do it.";
let challengeWords = challengeText.split(" ");

function highlightWordUpTo(index) {
    let text = "";
    for (let i = 0; i < challengeWords.length; i++) {
        let word = challengeWords[i];
        if (i < index)
            word = `<span class="color-correct">` + word + `</span>`;
        text = text + word + " ";
    }
    $('#challenge').html(text);
}

function updateWordsPerMinute(startTime, wordsTyped) {
    let millis = new Date().getTime() - startTime;
    let wpm = Math.floor(wordsTyped / (millis / (60 * 1000)));
    $('#stats').text(wpm + " wpm");
}

$(document).ready(() => {
    // setup challenge text
    $('#challenge').text(challengeText);

    let wordIndex = 0;
    let startTime = -1;

    let typer = $('#typer');
    typer.on('input', () => {
        if (startTime == -1)
            startTime = new Date().getTime();

        updateWordsPerMinute(startTime, wordIndex);

        if (typer.val().endsWith(" ")) {
            let currentWord = challengeWords[wordIndex];
            if (typer.val().substring(0, typer.val().length - 1) == currentWord) {
                wordIndex++;
                typer.val("");
                highlightWordUpTo(wordIndex);
            }
        }
    });
});
