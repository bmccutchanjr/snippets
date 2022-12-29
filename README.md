# snippets

I wrote Snippets to make it easier to develop and maintain HTML.  Snippets is a back-end module that builds an HTML file from smaller HTML modules.  The HTML modules are nothing more than HTML code that is used repeatedly throughout the site (think footers, navigation and the like).  But it could be anything.

## Installing snippets

Snippets is an NPM module intended for a NodeJS environment.  Install it just like any other dependency.

	npm i snippets

## Using snippets

Snippets is intended to merge two or more files each containing bits and pieces of HTML code into a single and complete file.  Snippets can be run when a client requests a page or it can be used to build static files that are served normally.  The former might be used during development and the latter on a production server.  But the choice is yours.

I wrote snippets to use with HTML files, but it ought to work with other kinds of files as well.

There are three components to snippets.

One or more files of HTML code to be merged.

A <snippet> tag must be added to one or more files.  The <snippet> tag identifies the file name of the module to import.

Your server (actually your server's routes) must execute the snippets() function.  Because no complete HTML file exists for your routes to serve, the routes must use .write() to serve the HTML to the client.

Althernatively, you can use snippets to build finalized HTML files.  In this case, your server <u>will</u> be returning a file to the client and doesn't need to call snippets().  It doesn't need to require the snippets module, either.
