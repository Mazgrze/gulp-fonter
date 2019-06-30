
let config = require("./config");

describe("font type validation tests", () => {
    test("should accept woff font", () => {
        expect(config.isAcceptableType("woff")).toBeTruthy();
    });
    test("should accept ttf font", () => {
        expect(config.isAcceptableType("ttf")).toBeTruthy();
    });
    test("should reject woff2 font", () => {
        expect(config.isAcceptableType("woff2")).toBeFalsy();
    });
});

describe("normalize config tests", () => {
    test("should accept null options parameter", () => {
        expect(() => config.normalizeConf(null, "ttf")).not.toThrow();
    });

    test("should match object", () => {
        expect(
            config.normalizeConf(
                {
                    compound2simple: true,
                    combinePath: true,
                    deflate: null,
                    inflate: false,
                    hinting: false,
                    subset: [66, 67, 68, 69],
                    formats: ["ttf", "eot", "woff"]
                },
                "eot"
            )
        ).toEqual(
            expect.objectContaining({
                compound2simple: true,
                combinePath: true,
                deflate: null,
                inflate: false,
                hinting: false,
                type: "eot",
                subset: [66, 67, 68, 69],
                formats: ["ttf", "eot", "woff"]
            })
        );
    });
    test("should filter formats", () => {
        expect(
            config.normalizeConf(
                {
                    formats: ["ttf", "eot", "woff", "woff2", "zip", "otf"]
                },
                "woff"
            )
        ).toEqual(
            expect.objectContaining({
                type: "woff",
                formats: ["ttf", "eot", "woff", "otf"]
            })
        );
    });
});
