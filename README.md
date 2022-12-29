# snippets

I wrote Snippets to make it easier to develop and maintain HTML.  Snippets is a back-end module that builds an HTML file from smaller HTML modules.  The HTML modules are nothing more than HTML code that is used repeatedly throughout the site (think footers, navigation and the like).  But it could be anything.

## Installing snippets

Snippets is an NPM module intended for a NodeJS environment.  Install it just like any other dependency.

>`npm i snippets`

## Using snippets

Snippets is intended to merge two or more files each containing bits and pieces of HTML code into a single and complete file.  Snippets can be run when a client requests a page or it can be used to build static files that are served normally.  The former might be used during development and the latter on a production server.  But the choice is yours.

I wrote snippets to use with HTML files, but it ought to work with other kinds of files as well.

There are three components to snippets.

One or more files of HTML code to be merged.

A `<snippet>` tag must be added to one or more files.  The `<snippet>` tag identifies the file name of the module to import.

Your server (actually your server's routes) must execute the `snippets()` function.  Because no complete HTML file exists for your routes to serve, your routes must use `.write()` rather than `.sendFile()` to serve the HTML to the client.

Alternatively, you can use snippets to build finalized HTML files.  In this case, your server <u>will</u> be returning a file to the client and doesn't need to call `snippets()`.  It doesn't need to `require` the snippets module, either.

>`snippet ("test module.snip");`

### The Snippet Tag

Somewhere in your source file, you will need to include a `<snippet>` tag.  It looks just like an HTML tag but that's not a problem.  The `<snippet>` tag will be replaced when you execute `snippet()`.

If there's an error in your code and the `<snippet>` tag is not replaced, it will be ignored by your web browser.

>`<snippet file="test module.snip">`

The `file` property is required and it's value is the name of the file you want to import.  The file extention is unimportant.

### The Snippets Function Call

>`snippet (file name, build, trim);`

- Only the `file name` is required.  It's a string value indicating the name of the file that other snippets will be merged into.

- If `build` is specified, `snippets()` will return `true` on success, or a JavaScript Error object.  `build` is the name of an output file that your final merged result will be written to.  It is a string.

- `trim` indicates whether the final output should be trimmed by removing `carriage returns`, `line feeds` and leading `tabs` and `spaces`.  The result isn't very pretty, but it's a but smaller, and your web browser will ignore those characters anyway.

`snippets()` returns a Promise.