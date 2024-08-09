import "dotenv/config";
import * as color from "picocolors";
import { spinner, outro, intro, confirm, isCancel } from "@clack/prompts";
const s = spinner();
const fs = require("fs");
const path = require("path");
import type { Decorator, TranslateNode } from "../../@types/index";
import { format } from "date-fns";
import { uuidv7 } from "uuidv7";
import { isFolder, readDir, readFile, writeFile } from "../utils/fs";
const yaml = require("js-yaml");

const today = format(Date.now(), "yyyy.MM.dd");

const ROOT_PATH =
  "D:/SteamLibrary/steamapps/common/Crusader Kings III/game/localization/english";

async function init() {
  await generateLocalizationMap();
}

async function generateLocalizationMap() {
  intro("Creating map of localization file structure");
  s.start(`Mapping ${color.blue(color.underline(ROOT_PATH))}`);
  let results = {
    path: ROOT_PATH,
    name: "english",
    children: await readDirDeep(ROOT_PATH),
  };
  s.stop(`All done mapping ${color.blue(color.underline(ROOT_PATH))}`);
  s.start(
    `Writing results to ${color.blue(
      color.underline(`./src/parser/map/${today}.json`)
    )}`
  );
  await writeFile(
    `./src/parser/map/${today}.json`,
    JSON.stringify(results, null, 4)
  );
  s.stop(
    `Results written to ${color.blue(
      color.underline(`./src/parser/map/${today}.json`)
    )}`
  );
  outro("All done");
}

const readDirDeep = async (targetPath: string): Promise<any> => {
  const results = [];
  try {
    const children = await readDir(targetPath);
    for (let child of children) {
      if (isFolder(`${targetPath}/${child}`)) {
        results.push({
          name: child,
          path: `${targetPath}/${child}`,
          children: await readDirDeep(`${targetPath}/${child}`),
        });
      } else {
        results.push({
          name: child,
          path: `${targetPath}/${child}`,
        });
      }
    }
    return results;
  } catch (err) {
    console.log(err);
  }
};

init();
