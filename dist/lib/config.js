"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    acceptableTypes: ['ttf', 'woff', 'eot', 'otf', 'svg'],
    isAcceptableType: function (type) {
        return this.acceptableTypes.includes(type);
    },
    defaults: {
        compound2simple: false,
        combinePath: false,
        deflate: null,
        inflate: false,
        hinting: false,
        subset: null // array of ascii values
    },
    filterFormats: function (_a) {
        var _this = this;
        var formats = _a.formats, type = _a.type;
        var fontFormats = [];
        if (formats && formats.length && Array.isArray(formats)) {
            fontFormats = formats.filter(function (type) {
                return _this.isAcceptableType(type);
            });
        }
        if (!fontFormats.length) {
            fontFormats.push(type);
        }
        return fontFormats;
    },
    normalizeConf: function (options, sourceFormat) {
        var conf = Object.assign(this.defaults, options, {
            type: sourceFormat
        });
        // Filter formats from input
        conf.formats = this.filterFormats(conf);
        // Convert string with letters to ascii codes array
        if (typeof conf.subset === 'string') {
            conf.subset = this.stringToAscii(conf.subset);
        }
        return conf;
    },
    stringToAscii: function (letters) {
        return letters
            .split('') // make array
            .map(function (letter) { return letter.charCodeAt(0); }) //convert to ascii codes
            .filter(function (code, index, self) {
            return self.indexOf(code) === index; // remove duplicates
        });
    }
};
