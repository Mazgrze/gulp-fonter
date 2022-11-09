"use strict";
var fonter = require('../index');
var fs = require('fs');
var VinylFile = require('vinyl');
var Font = require('fonteditor-core').Font;
describe('Integration tests', function () {
    var fileDir = __dirname + '/Roboto-Regular.ttf';
    var fakeFile = new VinylFile({
        contents: fs.readFileSync(fileDir),
        path: fileDir,
    });
    test('should match format extensions', function (done) {
        var myFonter = fonter();
        myFonter.write(fakeFile);
        myFonter.once('data', function (file) {
            // make sure it came out the same way it went in
            expect(file.isBuffer());
            expect(file.extname).toEqual('.ttf');
            done();
        });
    });
    test('should create 3 files', function (done) {
        var fontFormats = ['ttf', 'woff', 'eot'];
        var myFonter = fonter({ formats: fontFormats });
        myFonter.write(fakeFile);
        var onFile = jest.fn();
        myFonter.on('data', function (file) {
            // expect file matching filetypes
            expect(fontFormats.includes(file.extname.substring(1)));
            onFile();
        });
        myFonter.on('end', function () {
            // expect to be created 3 files
            expect(onFile).toBeCalledTimes(fontFormats.length);
            done();
        });
        myFonter.end();
    });
    test('should cut out glyphs', function (done) {
        var myStringSubset = 'abcdef';
        var myFonter = fonter({ subset: myStringSubset });
        myFonter.write(fakeFile);
        myFonter.once('data', function (file) {
            // Read font to get info
            var font = Font.create(file.contents, {
                type: 'ttf',
                subset: myStringSubset
            });
            // Glyphs count should be equal
            expect(Object.keys(font.data.cmap).length).toEqual(myStringSubset.length);
            // Glyphs ascii codes should match
            expect(Object.keys(font.data.cmap)).toEqual(myStringSubset.split('').map(function (l) { return l.charCodeAt(0).toString(); }));
            done();
        });
    });
});
