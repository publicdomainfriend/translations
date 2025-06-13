# Turn index.js into a valid JavaScript file that can be included in a Twine project. The output of this command is pdfTranslationScript.js in the FINAL_FILE folder.
./node_modules/.bin/esbuild index.js --bundle --outfile=./FINAL_FILE/pdfTranslationScript.js --global-name=pdfTranslationScript

# Make pdfTranslationScript globally accessible.
# From https://stackoverflow.com/questions/64806255/how-to-expose-a-class-to-the-global-scope-with-esbuild
echo "window.pdfTranslationScript = pdfTranslationScript;" >> ./FINAL_FILE/pdfTranslationScript.js

# Copy the valid JavaScript file into the output folder.
cp ./FINAL_FILE/pdfTranslationScript.js ../output