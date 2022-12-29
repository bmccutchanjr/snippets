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

			//	The <snippet> tag should specify a file name containing the code to import.  Extract the name from the tag

			let nameStart = compare.indexOf ("FILE=", snipStart);
			if (nameStart > snipEnd)
			{	//	A file specification was not found within the <snippet> tag, or it is improperly terminated.  Either
				//	snippets can do nothing with it.
				reject ("Bad <snippet>");
			}

			//	Extract everything in the source file from the nameStart to the end of the <snippet> tag

			let fileName = compare.substring (nameStart + 5, snipEnd);

			//	but we can't use it just yet.  The <snippet> tag may have bee written with quotation marks, leading spaces
			//	or trailing spaces.  Remove them...

			fileName = fileName.replaceAll ("\'", "");
			fileName = fileName.replaceAll ("\"", "");
			fileName = fileName.trim();

			fs.readFile (fileName, function (error, data)
			{	if (error) reject (error)
				else
				{	//	Replace all occurences of the <snippet> tag in the string code (NOT the comparison string that was
					//	converted to upper case).

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
	//	use a carriage return.

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

//		return code.replaceAll ("\n", "");
	return code.replace (/[\n\r]+/g, "");

	//	Someone explain to me why the commented code totally trashes the file but the replace() using regular
	//	expressions works.  What's the difference.
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

					resolve (data);
				})
				.catch (error => resolve (error));
			}
		});
	});
}

module.exports = snippet;