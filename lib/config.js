module.exports = {
    acceptableTypes: ['ttf', 'woff', 'eot', 'otf', 'svg'],
    isAcceptableType(type) {
        return this.acceptableTypes.includes(type);
    },
    defaults: {
        compound2simple: false, // transform ttf compound glyph to simple
        combinePath: false, // for svg path
        deflate: null, // deflate function
        inflate: false, // inflate function for woff
        hinting: false, // save font hinting
        subset: null // array of ascii values
    },
    normalizeConf(options, format) {
        let conf = Object.assign(this.defaults, options, { type: format });

        // Filter formats from input
        if (conf.formats && Array.isArray(conf.formats)) {
            conf.formats = conf.formats.filter(type =>
                this.isAcceptableType(type)
            );
        } else {
            conf.formats = [format]; // Just input format
        }
        // Convert string with letters to ascii codes array
        if (typeof conf.subset === 'string') {
            conf.subset = this.stringToAscii(conf.subset);
        }

        return conf;
    },
    stringToAscii(letters) {
        return letters
        .split('')   // make array
        .map(l => l.charCodeAt(0)) //convert to ascii codes
        .filter((code, index, self) => { 
            return self.indexOf(code) === index; // remove duplicates
        });
    }
};
