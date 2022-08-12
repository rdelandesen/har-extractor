import { describe } from "mocha";
import * as path from "path";
import { extract } from "../src/har-extractor";
import * as fs from "fs";
import * as assert from "assert";

const glob = require("glob");
const del = require("del");
const outputDir = path.join(__dirname, "output");
describe("har-extractor", () => {
    afterEach(() => {
        return del([outputDir]);
    });
    it("should extract to output directory", () => {
        const inputFile = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/en.wikipedia.org.har"), "utf-8"));
        extract(inputFile, {
            outputDir: outputDir,
        });
        const outputFiles = glob.sync(`${outputDir}/**`, {
            nodir: true,
        });
        assert.ok(outputFiles.length > 0);
    });
    it("should extract https://github.com/azu/har-extractor/issues/6", () => {
        const inputFile = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/seventow.har"), "utf-8"));
        extract(inputFile, {
            outputDir: outputDir,
        });
        const outputFiles = glob.sync(`${outputDir}/**`, {
            nodir: true,
        });
        assert.ok(outputFiles.length > 0);
    });
    it("should extract to output directory", () => {
        const inputFile = JSON.parse(
            fs.readFileSync(path.join(__dirname, "fixtures/hatebupwa.netlify.com.har"), "utf-8")
        );
        extract(inputFile, {
            outputDir: outputDir,
        });
        const outputFiles = glob.sync(`${outputDir}/**`, {
            nodir: true,
        });
        assert.ok(outputFiles.length > 0);
    });
    it("should respect --dry-run", () => {
        const inputFile = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/en.wikipedia.org.har"), "utf-8"));
        extract(inputFile, {
            outputDir: outputDir,
            dryRun: true,
        });
        const outputFiles = glob.sync(`${outputDir}/**`, {
            nodir: true,
        });
        assert.ok(outputFiles.length === 0);
    });
    it("should respect --keep-multiple-entries", () => {
        const inputFile = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/cdpn.io.har"), "utf-8"));
        extract(inputFile, {
            outputDir: outputDir,
            keepMultipleEntries: true,
        });
        const outputFiles = glob.sync(`${outputDir}/**`, {
            nodir: true,
        });
        assert.ok(outputFiles.length > 0);
        const matchedOutputFiles = outputFiles.filter((outputFile: string) => outputFile.match(/random/));
        assert.ok(matchedOutputFiles.length === 8);
    });
    it("should respect --filter-regex", () => {
        const filterRegex = /random/;
        const inputFile = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/cdpn.io.har"), "utf-8"));
        extract(inputFile, {
            outputDir: outputDir,
            filterRegex,
            keepMultipleEntries: true,
        });
        const outputFiles = glob.sync(`${outputDir}/**`, {
            nodir: true,
        });
        const expectedLength = 8;
        assert.ok(outputFiles.length === expectedLength);
        const matchedOutputFiles = outputFiles.filter((outputFile: string) => outputFile.match(filterRegex));
        assert.ok(matchedOutputFiles.length === expectedLength);
    });
});
