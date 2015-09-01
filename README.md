## shana2

just an image to html conversion / reformatting thing for my landing pages. it's ugly, yes, I know.

relies on http://www.text-image.com/convert/ to do the legwork in converting the image.

### usage

- install iojs or something that has some semblance of ES6 support

- stretch desired image vertically 400% in your favorite image editor (windows users, recommendation is Paint.NET; linux users, pinta)

- convert image via [text-image.com](http://www.text-image.com/convert/) with these settings:

![Conversion settings](/conversion_settings.png)

- obtain output html through desired method of choice (be it view source in browser, curl, etc.), then modify $fileName_original.html to add it in

- `node shana` when in the repo directory, and pray.

- avert eyes when viewing source code and/or running script, it's using regex to modify/parse html and may summon zalgo.

### example

Original image:

![Original image](/shana2.jpg)

Screenshot of rendered HTML (Mozilla Firefox):

![Screenshot of render](/shana2_example.png)
