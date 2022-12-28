//	snippet is intended for use in a NodeJS environment.  It is not yet an NPM module...

//	snippet() returns a Promise

const fs = require ("fs");

function snippet (source, build = false, trim = false)
{
	return new Promise ((resolve, reject) =>
	{	
		fs.readFile (source, function (err, buffer)
		{
			const file = buffer.toString();

			let start = file.indexOf ("<snippet")
			if (start != 0)
			{
				let end = file.indexOf (">", start) + 1;

				const snipTag = file.substring (start, end);

				let nameStart = snipTag.indexOf (" file=\"");

				let nameEnd = snipTag.indexOf ("\">");

				const snipFile = snipTag.substring (nameStart + 7, nameEnd);
				fs.readFile (snipFile, function (err, snippet)
				{
					let newFile = file.replace (snipTag, snippet);

					resolve (newFile);
					
				});
			}		
		});
	})
}

module.exports = snippet;