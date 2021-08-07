$( document ).ready(function() {
    let typer = $('#typer');
    typer.on('input', () => {
        if (typer.val().endsWith(" ")) {
            typer.val("");
        }
    });
});
