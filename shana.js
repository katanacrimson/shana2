//
// shana.js - horrible evil thing wherein I use regex to manipulate html and make a pretty landing page
// ---
// @copyright (c) 2014-2015 Damian Bushong <katana@odios.us>
// @license MIT license
// @url <https://github.com/damianb/>
// @reddit <https://reddit.com/u/katana__>
// @twitter <https://twitter.com/blazingcrimson>
//
"use strict"

//
// notes: original image must be stretched heightwise by 4x before conversion, otherwise it will not appear correctly
// image converted to html via: http://www.text-image.com/convert/
//

let fileName = 'shana2'

let fs = require('fs')
let shana2 = fs.readFileSync('./' + fileName + '_original.html').toString()
// HE COMES
let re = /(?:<(font) color=([\#\w]+)>(#+)<\/font>|<(br)>)/g

let shana = {
	html: '',
	css: ''
}
let colors = {}

shana.html += '<!DOCTYPE html>' + "\n" +
	'<html lang="en-us">' + "\n" +
	'<head>' + "\n\t" +
	'<meta charset="utf-8" />' + "\n\t" +
	'<title>flame haze~</title>' + "\n\t" +
	'%style%' + "\n" +
	'</head>' + "\n" +
	'<body>' + "\n\t" +
	'<pre>' + "\n"

shana.css += '/*!' + "\n" +
	' * <3' + "\n" +
	' */' + "\n" +
	'pre{font-size:8px;font-family:"Consolas","Courier New",monospace;line-height:3px;color:#ffffff;letter-spacing:1px}'

let onNewline = true
let matches
while((matches = re.exec(shana2)) !== null) {
	let tagType = matches[1], color = '', inner = ''
	if(tagType !== 'br' && matches[0] !== '<br>') {
		color = matches[2]
		inner = matches[3]
	} else {
		// special linebreak logic
		shana.html += "\n"
		onNewline = true
		continue
	}

	// mind: strings are 0-indexed, yes, but color codes are pulled in as '#aabbcc' - ignore the 0th character
	if(!!color && color === 'white') {
		color = '#fff'
	} else if(!!color && color === 'black') {
		color = '#000'
	} else if (!!color && color.length === 7) {
		// compress #aabbcc into #abc
		if(color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
			color = '#' + color[1] + color[3] + color[5]
		}
	}

	// some "pixel" counting, here, just for stat purposes. :)
	// also how we track what css color classes are actually in use
	if(!colors[color]) {
		colors[color] = inner.length
	} else {
		colors[color] += inner.length
	}

	// if color = white, or color = #fff, then we're replacing #'s with &nbsp;'s, to speed up browser rendering.
	if(color === '#fff') {
		inner = '&nbsp;'.repeat(inner.length)
	} else {
		inner = '<span class="h' + color.substr(1) + '">' + inner + '</span>'
	}

	// new lines get a double-tab beforehand
	if(onNewline) {
		shana.html += "\t\t"
		onNewline = false
	}
	shana.html += inner
}
shana.html +=	"\t" + '</pre>' + "\n" +
	'</body>' + "\n" +
	'</html>'

fs.writeFileSync('./' + fileName + '_externalcss.html', shana.html.replace(/%style%/, '<link href="' + fileName + '.css" rel="stylesheet">'))
fs.writeFileSync('./' + fileName + '_colors.json', JSON.stringify(colors, null, '  '))
Object.keys(colors).forEach(function(color) {
	shana.css += 'span.h' + color.substr(1) + '{color:' + color + '}'
})

fs.writeFileSync('./' + fileName + '.css', shana.css)
fs.writeFileSync('./' + fileName + '.html', shana.html.replace(/%style%/, '<style>' + shana.css + '</style>'))
