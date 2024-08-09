import "dotenv/config";
import * as color from "picocolors";
import { spinner, outro, intro, confirm, isCancel } from "@clack/prompts";
const s = spinner();
const fs = require("fs");
const path = require("path");
import type { Decorator, TranslateNode } from "../../@types/index";
import { format } from "date-fns";
import { uuidv7 } from "uuidv7";
import { readFile, writeFile } from "../utils/fs";
const yaml = require("js-yaml");

async function test() {
  let result = await writeYAMLFile();
  console.log(result);
  await writeFile("./sandbox/yaml.yml", result);
}

async function testParse() {
  let result = await parseYAMLFile();
  console.log(result);
  await writeFile("./sandbox/yaml.json", JSON.stringify(result, null, 4));
}

async function parseYAMLFile() {
  try {
    const data = await readFile(
      "./sandbox/tests/localization/hostages_l_english.yml"
    );
    console.log(data);
    return yaml.load(data);
  } catch (err) {
    console.log(err);
  }
}

async function writeYAMLFile() {
  try {
    // const targetFile = JSON.parse();
    const targetFile = await readFile("./sandbox/yaml.json");
    console.log(targetFile);
    return yaml.dump(targetFile, {
      indent: 1,
      forceQuotes: true,
      quotingType: '"',
    });
  } catch (err) {
    console.log(err);
  }
}

test();
