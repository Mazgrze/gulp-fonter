"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var Transform = require("stream").Transform;
var Font = require("fonteditor-core").Font;
var config = require("./lib/config");
module.exports = function (options) {
    if (options === void 0) { options = {}; }
    var transformStream = new Transform({ objectMode: true });
    transformStream._transform = function (source, encoding, callback) {
        var fontType = source.extname.substr(1);
        // Check if font type is proper
        if (!config.isAcceptableType(fontType)) {
            console.log(fontType, "is not accepted type of font. Will just copy file");
            return callback(null, source);
        }
        var normalizedConf = config.normalizeConf(options, fontType);
        var fontBuffer = source.contents;
        try {
            var font = Font.create(fontBuffer, normalizedConf);
            for (var _i = 0, _a = normalizedConf.formats; _i < _a.length; _i++) {
                var type = _a[_i];
                //clone file
                var newFont = source.clone();
                newFont.path = path_1.default.resolve(source.dirname, source.stem, type);
                //convert font buffer
                newFont.contents = font.write(config.normalizeConf(normalizedConf, type));
                this.push(newFont); // add new file to stream
            }
            callback();
        }
        catch (e) {
            //Fallback: copy original file;
            console.log(e.message, "on", source.basename, "- Will just copy file");
            return callback(null, source);
        }
    };
    return transformStream;
};
