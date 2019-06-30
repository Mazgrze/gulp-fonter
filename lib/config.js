module.exports = {
    acceptableTypes: ["ttf", "woff", "eot", "otf", "svg"],
    isAcceptableType(type) {
        return this.acceptableTypes.includes(type);
    },
    defaults: {
        compound2simple: false, // transform ttf compound glyf to simple
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
        return conf;
    }
};
