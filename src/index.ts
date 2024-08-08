import "dotenv/config";
import * as color from "picocolors";
import { spinner, outro, intro, confirm, isCancel } from "@clack/prompts";
const s = spinner();
const fs = require("fs");
const path = require("path");
import testCase from "../sandbox/source.json";
import { format } from "date-fns";
import { uuidv7 } from "uuidv7";
import { readFile, writeFile } from "./utils/fs";
var grammarify = require("grammarify");
// @ts-ignore
import translate from "translate";
import langModel from "./utils/languages.json";
type Decorator = {
  title?: string;
  desc: string;
};
type TranslateNode = {
  lang: string;
  index: number;
  title: string;
  desc: string;
};

translate.engine = "libre";
translate.key = process.env.TRANSLATE_KEY;
const LOG = {
  time: {
    start: Date.now(),
    end: 0,
    date: format(Date.now(), "MM/dd/yyyy"),
    ofDay: format(Date.now(), "h:mma"),
    day: format(Date.now(), "EEEE"),
  },
};

async function init() {
  intro(`${color.bgGreen(" TRANSLATE-MOD ")}`);
  await testTranslation(testCase.nickname, true, false);
  // await simpleTest();
}

async function simpleTest() {
  let str = "Quick brown fox jumped over the lazy dog";
  let result = await translate(str, {
    to: "es",
  });
  console.log(result);
}

async function sleep(ms = 5000, asSeconds = false): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        resolve(true);
      },
      asSeconds ? ms * 1000 : ms
    );
  });
}

async function testTranslation(
  value: Decorator,
  isGrammar = true,
  useTitle = false
) {
  try {
    const original = useTitle ? value.title : value.desc;
    let chain = ["en"] as string[];
    let result = [
      {
        lang: "es",
        index: -2,
        title: "abc",
        desc: original,
      },
    ] as TranslateNode[];
    let rollCount = randomNumber(
      langModel.safe.length - 2,
      langModel.safe.length / 2
    );
    let lastStr = original;
    let valueList = [] as string[];
    for (let i = 0; i < rollCount; i++) {
      let chosenLang = getRandomLanguage(chain);
      let lastLang = chain[chain.length - 1];
      chain.push(chosenLang);
      s.start(
        `Translating from: ${color.green(lastLang)} to: ${color.green(
          chosenLang
        )}`
      );
      const temp = await translate(lastStr, {
        to: chosenLang,
        from: lastLang,
      });
      valueList.push(temp);
      lastStr = temp;
      result.push({
        lang: chosenLang,
        index: i,
        title: "abc",
        desc: temp,
      });
      s.stop(
        `Successfully translated to ${color.green(chosenLang.toUpperCase())}`
      );
    }
    s.start("Translating back to English");
    let final = await translate(lastStr, {
      to: "en",
      from: chain[chain.length - 1],
    });
    result.push({
      lang: "en",
      index: -1,
      title: "abc",
      desc: isGrammar ? grammarify.clean(final) : final,
    });
    s.stop("Successfully translated back to English");
    await writeFile("./sandbox/results.json", JSON.stringify(result, null, 4));
    await writeFile(
      "./sandbox/results.md",
      `##ORIGINAL:\r\n${original}\r\n\r\nTRANSLATED:\r\n${
        result[result.length - 1].desc
      }`
    );
    outro(
      `Results have been written in ${color.blue(
        color.underline("./sandbox/results.json")
      )}`
    );
  } catch (err) {
    console.log(err);
  }
}

function getRandomLanguage(chain: string[]) {
  let haystack = langModel.safe.filter((str: string) => !chain.includes(str));
  return haystack[randomNumber(haystack.length - 1)];
}

function randomNumber(max: number, min = 0) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

init();
