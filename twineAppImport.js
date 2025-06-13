/* This script imports the translation script from Neocities, where it is hosted, so it can be used in your Twine Sugarcube project.

It won't work without an internet connection.

Recommended for use with the Twine app.
*/

/*
Set flag after script is loaded.
https://twinery.org/questions/41026/loading-external-local-javascript-files-sugarcube-2
*/

window.JSLoaded = false;

importScripts("https://publicdomainfriend.neocities.org/pdfTranslationScript.js")
	.then(() => {
		window.JSLoaded = true;
	})
    .catch(() => {
		alert("Error loading translation script. Translation will not work properly.");
});

/* 
Only run addTranslations after external script is loaded.
https://stackoverflow.com/a/22125915
*/
setup.addTranslations = function(arg1, arg2, arg3) {
    if(window.JSLoaded === false) {
       window.setTimeout(() => {setup.addTranslations(arg1, arg2, arg3)}, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      window.pdfTranslationScript.addTranslations(arg1, arg2, arg3);
    }
}