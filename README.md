This is a Tweego codebase for a Twine Sugarcube 2 project. It demonstrates a translation mechanic used in <a href="https://publicdomainfriend.itch.io/crane">黃鶴楼</a> and <a href="https://publicdomainfriend.itch.io/translations">Translations</a>, inspired by the translations in <a href="https://slugzuki.itch.io/piele">piele</a> and <a href="https://slugzuki.itch.io/verses">Verses</a> by Kit Riemer. The code is public domain.

## To Use

If you are viewing this on Github, download the repository zip file with this link.

### Add the Files

I use Tweego and recommend it, but this can work with Sugarcube 2 and either Tweego or the Twine app.

**If using Twine Sugarcube 2 with the Twine app**, to add the translation mechanic to your own game, you need to follow the below instructions. Alternatively, you can download Translations - Twine App Version.html and import it into Twine.

-   Copy the contents of `twineAppImport.js` into your Story JavaScript.
-   Copy the contents of `pdfTranslationStyle.css` in `src` into your Story CSS.
-   Optional: copy the contents of `fonts.css` in `src` into your Story CSS. You can replace Noto Serif SC with something else if you wish.
-   Optional: copy the contents of `hideSidebar.js` in `src` into your Story JavaScript to get rid of the sidebar.
-   Due to JavaScript's list syntax using square brackets `[]`, you will see broken links to nonexistent passages in the app. This is normal and can be ignored.

**If using Twine Sugarcube 2 with Tweego**, to add the translation mechanic to your own game, you need to:

-   Copy the `pdfTranslationScript.js` in `output` into your output folder, the folder containing your game's HTML file.
-   Copy the `pdfTranslationImport.js` in `src` into your source folder, the folder you build to create the final HTML file.
-   Copy the `pdfTranslationStyle.css` in `src` into your source folder.
-   Optional: copy the contents of `fonts.css` in `src` into your Story CSS. You can replace Noto Serif SC with something else if you wish.
-   Optional: copy the contents of `hideSidebar.js` in `src` into your Story JavaScript to get rid of the sidebar.

### Create the Translations

#### The JavaScript Notation

Each translation is an array with two items in it. The first item is the initial meaning, and the second item is the final meaning. The first item can either be a string or a list of translations, while the second item is always a list of strings.

(Strings are text, and indicated with quotation marks `""`. Arrays are lists, and indicated with square brackets `[]`.)

Example: `["处", ["residing", "dwelling", "outside"]]`

In the above translation, the first item/initial meaning is the string `"处"`, and the second item/final meaning is the list of strings `["residing", "dwelling", "outside"]`.

As mentioned, the first item/initial meaning can also be an array of other translations. If this is the case, then every single translation in the array needs to be finished before the final meanings for this translation will show up.

Example:

```js
[
    [
        ["游", ["travel", "tour", "wander", "roam"]],
        ["人", ["people", "humans"]],
    ],
    ["visitors", "wanderers", "tourists"],
];
```

In the above translation, the first item/initial meaning is the array of translations `[["游", ["travel", "tour", "wander", "roam"]], ["人", ["people", "humans"]],]`, containing two translations for 游 and 人 respectively. The second item/final meaning is the list of strings `["visitors", "wanderers", "tourists"]`. The characters 游 and 人 will show up first, and only once the characters have both been clicked, and their translations show up, will the option to click "travel people" and turn it into "visitors" appear.

Each string in the second item/final meaning can also contain HTML elements, which is useful for things like adding line breaks to translated poetry.

Example from 黃鶴楼:

```js
[
    [h0, h1, h2, h3, "！"],
    ["<br/>The tide of my heart swells with the waves.", "<br/>Let the tides uplift my soul!", "<br/>My heart surges with the shoal!", "<br/>Let wine and spirits overflow!"],
];
```

#### Variables

You can create variables in JavaScript. Variables can be declared with the `var` keyword. Example: `var five = "five";` I use variables exclusively for organizing translations. Theoretically, each translation could just be one giant variable, but it would be hard to manage.

With variables, we can write:

```js
var long = ["久", ["long time"]];
var longFinal = [[long], ["long"]];
```

instead of:

```js
var longFinal = [[["久", ["long time"]]], ["long"]];
```

This becomes important when dealing with longer translations.

As a side note, you're supposed to end every variable declaration in JavaScript with a semicolon `;`, as well as every line where you call a function, though nothing usually happens if you forget it.

Variable names, unlike strings, aren't surrounded by parentheses.

#### Add Translations To The Passage

Let's say you have a translation you like.

First, you will want to add this to your passage exactly, preferably at the end so it doesn't show up as whitespace:

```
<<done>><<script>>

<</script>><</done>>
```

This adds JavaScript to the passage that will be executed when the passage is done loading. This is what will create your translations.

Between the `<<done>><<script>>` and `<</script>><</done>>`, put in the code of your translations.

At the end of your code, before the closing `<</script>><</done>>`, add the line `setup.addTranslations([FINAL_TRANSLATION]);`. The `FINAL_TRANSLATION` should be replaced with the name of your final translation variable. Example: if your final translation variable is called `longFinal`, you should add `setup.addTranslations([longFinal]);`. **Don't forget the square brackets.**

In the body of the passage, in the location you want the translation to be, add this `translationContainer` HTML div:

```html
<div id="translationContainer" class="translationStyle"><br data-i="0" /></div>
```

This is the div that will be automatically detected and replaced with the translation.

#### Multiple Translations

If you want to have multiple translations, you can make `FINAL_TRANSLATION` be a variable that's an array of translations instead of just one translation.

Inside the `translationContainer` div, you will need to add more `br` elements with a `data-id` attribute corresponding to the position of the translation within the array. The `data-id` attribute starts counting at 0, not 1 (zero-indexed).

Example: with three translations, it would look like:

```html
<div id="translationContainer" class="translationStyle"><br data-i="0" /><br data-i="1" /><br data-i="2" /></div>
```

and then your code might look something like:

```
<<done>><<script>>
var red = ["红", ["red", "redden"]];
var green = ["绿", ["green"]];
var blue = ["蓝", ["blue"]];

var finalTranslations = [red, green, blue];
setup.addTranslations(finalTranslations);
<</script>><</done>>
```

I selected three random colors.

How it works: Each individual `br` element will be replaced with the respective translation in the list. So because red is first in the list, `<br data-i="0" />` will be replaced by the red translation, while `<br data-i="1" />` will be replaced by green, and `<br data-i="2" />` by blue.

This means you can reorder the `br` elements if you want the translations to show up in a different order. This also means you can place anything between the `data-i` elements, and the translation will still show up as usual. You can use this for punctuation or other interesting things. Example:

```html
<div id="translationContainer" class="translationStyle">
    🟦 <br data-i="2" /> 🟦
    🟩 <br data-i="1" /> 🟩
    🟥 <br data-i="0" /> 🟥
</div>
```

You technically don't need to use `br` elements, and any HTML element will do as long as it has the correct `data-i` attribute, since it all gets replaced anyway. But I like `br` for being small and self-closing.

#### Multiple Translation Containers

You can pass a second argument to `setup.addTranslations()`: the id of the HTML container element where the translations will be rendered. This value defaults to `translationContainer` if it's not provided, but you can use a different id if you want. The container element should have the `translationStyle` class for the CSS to work correctly. There also needs to be the correct number of `data-i` elements inside the container.

I recommend using `document.getElementById()` for getting HTML elements as variables.

Example:

```
:: Test
<div id="MY_AWESOME_CONTAINER" class="translationStyle">
    <br data-i="0" />
</div>

<<done>><<script>>
    var red = ["红", ["red", "redden"]];
    setup.addTranslations(red, "MY_AWESOME_CONTAINER");
<</script>><</done>>
```

#### Show An Element When A Translation Is Finished

You can pass a third argument to `setup.addTranslations()`: the id of an HTML element that shows up once everything is translated. This element will automatically be hidden when the passage loads, until the translation is done, at which point it will automatically appear.

Using the third argument requires you to use the second argument.

Potential uses: The third argument could be the id of an HTML container element with another translation in it, or a link to the next passage.

**I recommend adding the CSS class `hidden` to the hidden element manually anyway, because hiding the element may take a brief time. Without adding the `hidden` class manually, the element may show up for a short moment. The `hidden` class is defined in `src/pdfTranslationStyle.css` to manage hiding elements.**

```
:: Example1
<div id="container1" class="translationStyle"><br data-i="0" /></div>
<div id="container2" class="translationStyle hidden"><br data-i="0" /></div>
<div id="container3" class="translationStyle hidden"><br data-i="0" /></div>

<span id="nextLink" class="hidden">[[Next|Example2]]</span>

<<done>><<script>>
var red = ["红", ["red", "redden"]];
var green = ["绿", ["green"]];
var blue = ["蓝", ["blue"]];

setup.addTranslations([red], "container1", "container2");
setup.addTranslations([green], "container2", "container3");
setup.addTranslations([blue], "container3", "nextLink");
<</script>><</done>>
```

## File Guide

**The `output` folder is the output folder of the Tweego project.**

-   Inside `output`, `pdfTranslationScript.js` is the JavaScript code that handles the translations.

**The `src` folder is the source folder of the Tweego project.**

-   Inside `src`, `pdfTranslationImport.js` is a line that imports the code in pdfTranslationScript.js into your final game.
-   Inside `src`, `pdfTranslationStyle.css` is the CSS that determines how translations look. Font size, color, etc.
-   Inside `src`, `fonts.css` is an additional CSS file that adds the Noto Serif SC font to the game.
-   Inside `src`, `exampleStory.tw` is the rest of the source code for Translations.
-   Inside `src`, `unused.tw` contains unused passages that can be viewed as examples. Just change the start passage of the story to Example1.
-   Inside `src`, `hideSidebar.js` contains code that removes the default Sugarcube sidebar.

**You can safely ignore everything in the pdfTranslationScript folder.** The folder contains the Typescript source code that is transformed into pdfTranslationScript.js. You can change it if you know Typescript.
