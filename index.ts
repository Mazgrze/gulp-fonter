import { FinalConfiguration, InputConfiguration, FontType } from "./lib/types";
import { TransformCallback } from "stream";

import path from "path";
const { Transform } = require("stream");
const { Font } = require("fonteditor-core");
const config = require("./lib/config");

module.exports = function (options: InputConfiguration = {}) {
  const transformStream = new Transform({ objectMode: true });
  transformStream._transform = function (
    source: any,
    encoding: string,
    callback: TransformCallback
  ) {
    const fontType: String = source.extname.substr(1);

    // Check if font type is proper
    if (!config.isAcceptableType(fontType)) {
      console.log(
        fontType,
        "is not accepted type of font. Will just copy file"
      );
      return callback(null, source);
    }

    const normalizedConf: FinalConfiguration = config.normalizeConf(
      options,
      fontType
    );
    const fontBuffer = source.contents;

    try {
      const font = Font.create(fontBuffer, normalizedConf);
      for (let type of normalizedConf.formats) {
        //clone file
        const newFont = source.clone();
        const file = `${source.stem}.${type}`
        newFont.path = path.resolve(source.dirname, file);

        //convert font buffer
        newFont.contents = font.write(
          config.normalizeConf(normalizedConf, type)
        );
        this.push(newFont); // add new file to stream
      }
      callback();
    } catch (e) {
      //Fallback: copy original file;
      console.log(e.message, "on", source.basename, "- Will just copy file");
      return callback(null, source);
    }
  };

  return transformStream;
};
