import "dotenv/config";
import * as color from "picocolors";
import { spinner, outro, intro, confirm, isCancel } from "@clack/prompts";
const s = spinner();
import type { LocalizationMapItem } from "../../@types/index";
import { format } from "date-fns";
import {
  isFolder,
  readDir,
  readFile,
  writeFile,
  ensurePath,
} from "../utils/fs";
const yaml = require("js-yaml");
const today = format(Date.now(), "yyyy.MM.dd");

const ROOT_PATH =
  "D:/SteamLibrary/steamapps/common/Crusader Kings III/game/localization/english";

const TEST_PATH =
  "./sandbox/game/localization/english/accolades/accolades_l_english.yml";

async function init() {
  // const dataMap = await readFile(`./src/parser/map/2024.08.08slim.json`);
  // let tokenizedList = await tokenizeFilesFromLocalizationMap(dataMap.children);
  await getTotalCharacterLengthOfLocalizations();
}

async function getTotalCharacterLengthOfLocalizations() {
  s.start("Crunching data");
  await compileCharacterLengthFromLocalizationMap();
  const data = await readFile("./sandbox/dump.txt");
  s.stop(`Total character length is ${color.yellow(data.length)}`);
}

function makeRelative(filePath: string) {
  return filePath.replace(ROOT_PATH, "./sandbox/english");
}

async function tokenizeFilesFromLocalizationMap(list: LocalizationMapItem[]) {
  const results = [] as any[];
  for (let item of list) {
    if (Object.keys(item).includes("children")) {
      results.push(
        await tokenizeFilesFromLocalizationMap(
          item.children as LocalizationMapItem[]
        )
      );
    } else {
      results.push(await tokenizeFileFromLocalizationMap(item));
    }
  }
  return results;
}

async function tokenizeFileFromLocalizationMap(item: LocalizationMapItem) {
  const rawtext = await readFile(item.path);
  let result = {
    path: item.path,
    name: item.name,
    rawtext: rawtext,
    data: yaml.load(rawtext),
  };
  await writeFile(
    `${makeRelative(item.path).replace(/\.yml$/, ".json")}`,
    JSON.stringify(result, null, 4)
  );
  return result;
}

async function compileCharacterLengthFromLocalizationMap() {
  const root = await readFile("./src/parser/map/2024.08.08.json");
  // Reset the value so we don't double up
  await writeFile("./sandbox/dump.txt", "");
  await dumpLocalizationMapToTempFile(root.children);
  return true;
}

async function dumpLocalizationMapToTempFile(
  list: LocalizationMapItem[],
  dest = "./sandbox/dump.txt"
) {
  for (let item of list) {
    if (Object.keys(item).includes("children")) {
      await dumpLocalizationMapToTempFile(
        item.children as LocalizationMapItem[]
      );
    } else {
      await unfoldLocalizationFileDump(item.path, dest);
    }
  }
  return true;
}

async function unfoldLocalizationFileDump(filePath: string, dest: string) {
  try {
    const temp = await readFile(filePath);
    const sanitized = temp.replace(/^(\s?)\n(?!=\w)/gm, "");
    // console.log(temp);
    const data = yaml.load(temp);
    const values = deepValues(data);
    const lastText = await readFile(dest);
    await writeFile(dest, lastText + values.join(""));
  } catch (err) {
    console.log(err);
  }
}

function deepValues(obj: any): any[] {
  const values = [];
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      values.push(...deepValues(obj[key]));
    } else {
      values.push(obj[key]);
    }
  }
  return values;
}

async function generateLocalizationMap() {
  intro("Creating map of localization file structure");
  s.start(`Mapping ${color.blue(color.underline(ROOT_PATH))}`);
  let results = {
    path: ROOT_PATH,
    name: "english",
    children: await readDirDeep(ROOT_PATH),
  } as LocalizationMapItem;
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

const readDirDeep = async (
  targetPath: string
): Promise<LocalizationMapItem[]> => {
  const results = [];
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
};

init();
