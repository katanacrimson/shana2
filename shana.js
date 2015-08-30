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

let fs = require('fs')
let shana2 = fs.readFileSync('./shana2_original.html').toString()
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
	'<style style="display:none">%style%</style>' + "\n" +
	'</head>' + "\n" +
	'<body>' + "\n\t" +
	'<pre>' + "\n"

shana.css += '/*!' + "\n" +
	' * ' + "\n" +
	' */' + "\n" +
	'pre{font:8px monospace;line-height:3px;color:#ffffff}'

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
	} else if (!!color && color.length === 7) {
		// compress #aabbcc into #abc
		if(color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
			color = '#' + color[1] + color[3] + color[5]
		}
	}

	// some "pixel" counting, here. :)
	// also how we track what css color classes are actually in use
	if(!colors[color]) {
		colors[color] = inner.length
	} else {
		colors[color] += inner.length
	}

	// if color = white, or color = #fff, then we're replacing #'s with &nbsp;'s, to speed up browser rendering.
	if(color === '#fff') {
		let length = inner.length
		inner = '&nbsp;'.repeat(length)
	} else {
		let colorClass = color.substr(1)
		inner = '<span class="h' + colorClass + '">' + inner + '</span>'
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

fs.writeFileSync('./shana2_externalcss.html', shana.html)
//delete shana.html

fs.writeFileSync('./shana_colors.json', JSON.stringify(colors, null, '  '))
Object.keys(colors).forEach(function(color) {
	if(color === '#fff') {
		return
	}
	let tColor = color.substr(1)
	shana.css += 'span.h' + tColor + '{color:' + color + '}'
})

fs.writeFileSync('./shana2.css', shana.css)

fs.writeFileSync('./shana2.html', shana.html.replace(/%style%/, shana.css))
