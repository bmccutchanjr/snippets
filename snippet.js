//	snippet is intended for use in a NodeJS environment.  It is not yet an NPM module...

//	snippet() returns a Promise

const fs = require ("fs");

function processTheSnippet (code)
{
	return new Promise ((resolve, reject) =>
	{	
		const compare = code.toUpperCase();

		//	Now find the <snippet> tag...

		const snipStart = compare.indexOf ("<SNIPPET");
		if (snipStart < 0) resolve (code);
		else
		{	//	If no <snippet> tag is found, we're done...otherwise, replace the <snippet> tag with the content of the
			//	specified file and call processTheSnippet() again...

			//	Find the terminating angle bracket ( > ) for the <snippet> tag

			const snipEnd = compare.indexOf (">", snipStart);

			//	The <snippet> tag should specify a file name containing the code to import.  Extract the name from the
			//	tag

			let nameStart = compare.indexOf ("FILE=", snipStart);
			if (nameStart > snipEnd)
			{	//	A file specification was not found within the <snippet> tag, or it's improperly terminated.  Either
				//	way snippets can do nothing with it.
				reject (new Error ("Bad <snippet>"));
			}

			//	Extract everything in the source file from the nameStart to the end of the <snippet> tag

			let fileName = compare.substring (nameStart + 5, snipEnd);

			//	but we can't use it just yet.  The <snippet> tag may have been written with quotation marks, leading or
			//	trailing spaces.  Remove them...

			fileName = fileName.replaceAll ("\'", "");
			fileName = fileName.replaceAll ("\"", "");
			fileName = fileName.trim();

			fs.readFile (fileName, function (error, data)
			{	if (error) reject (error)
				else
				{	//	Replace all occurences of the <snippet> tag in the string code (NOT the comparison string that
					//	we've been using).

					code = code.replaceAll (code.substring (snipStart, (snipEnd + 1)), data.toString());

					processTheSnippet (code)
					.then (data => resolve (data))
					.catch (error => reject (error));
				}
			})
		}
	})
}

function trimCode (code)
{	//	Remove any leading or trailing whitespace from each line of the code.

	//	Some text editors use a combination of line-feed and carriage-return to indicate a new line, and others only
	//	use a carriage return.  Let's make life easier by replacing carriage-return and line-feed combinations with
	//	just a line-feed.  They could be in either order...

	code = code.replaceAll ("\n\r", "\n");
	code = code.replaceAll ("\r\n", "\n");

	//	A list of strings to remove...

	const strings = [ "\n\t\t\t\t", "\n\t\t\t", "\n\t\t", "\n\t", "\n            ", "\n        ", "\n    ", "\n ", "\t\n", " \n" ];

	for (let i=0; i<strings.length; i++)
	{	let pos = code.indexOf (strings[i]);
		while (pos > 0)
		{
			code = code.replaceAll (strings[i], "\n");
			pos = code.indexOf (strings[i]);
		}
	}

	return code.replaceAll ("\n", "");
}

function snippet (source, build = false, trim = false)
{	//	This is the entry point for the module.  It's purpose is to open the base file and pass the contents of the
	//	file to processTheSnippet() for processing.  If build and trim are specified, that happens here also.

	return new Promise ((resolve, reject) =>
	{	//	File I/O is an asynchronous process.  snippets returns a Promise...

		fs.readFile (source, function (error, buffer)
		{	if (error) reject (error)
			else
			{
				processTheSnippet (buffer.toString())
				.then (data =>
				{	//	If build or trim are specified, this is where it has to happen.  Until that gets written...

					if (trim) data = trimCode (data);

				if (build)
				{	//	If build is specified, the merged HTML is to be written to a file.  The function will return
					//	either an error or a boolean true (indicating success), but not the merged HTML.

					fs.writeFile (build, data, error =>
					{	if (error) reject (error)
						else resolve (true);
					});
				}
				else
					resolve (data);
				})
				.catch (error => resolve (error));
			}
		});
	});
}

module.exports = snippet;

//	All it needs now is some code to allow snippets to run from the command line.  Check for arguments passed through
//	the process onject and call snippets()...

if (process.argv.length > 2)
{	//	If process.argv has no more than one or two elements, this is probably not being called from the command line.

	const file = process.argv[2];
	const build = process.argv[3] ? process.argv[3] : null;
	const trim = process.argv[4] ? process.argv[4] : false;

	snippet (file, build, trim)
	.then (_ => console.log ("Success!"))
	.catch (error => console.log (error));
}