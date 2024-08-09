const fs = require("fs");
const path = require("path");

export const renameFile = (oldFilePath: string, newFilePath: string) => {
  return new Promise((resolve, reject) => {
    if (!exists(oldFilePath)) reject(false);
    fs.rename(
      path.resolve(oldFilePath),
      path.resolve(newFilePath),
      (err: any) => {
        if (err) reject(false);
        else resolve(true);
      }
    );
  });
};

export const ensurePath = async (filePath: string) => {
  const folders = path
    .resolve(filePath)
    .split(path.sep)
    .map((v: string, i: number, a: string[]) => a.slice(0, i).join(path.sep))
    .filter((v: string) => v.length);
  for (let folder of folders) if (!exists(folder)) await makeFolder(folder);
};

export const writeFile = (
  filePath: string,
  data: any,
  encoding = "utf-8"
): Promise<Error | boolean> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(filePath),
      data,
      { encoding: encoding },
      (err: Error): void => {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });
};

export const writeBuffer = (
  filePath: string,
  data: any
): Promise<Error | boolean> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(filePath), data, (err: Error): void => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

export const makeFolder = (targetPath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(targetPath), (err: Error): void => {
      return err ? reject(false) : resolve(true);
    });
  });
};

export const readFile = (
  targetPath: string,
  verbose = false,
  asBuffer = false
): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(targetPath),
      asBuffer ? null : "utf-8",
      (err: Error, data: any): void => {
        if (err) reject(err);
        else resolve(isJSON(data) ? JSON.parse(data) : data);
      }
    );
  });
};

export const readDir = async (targetPath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!exists(targetPath) || !isFolder(targetPath))
      reject("Path is not a folder or does not exist");
    fs.readdir(
      path.resolve(targetPath),
      { encoding: "utf-8" },
      (err: Error, files: string[]) => {
        if (err) reject(err);
        resolve(files);
      }
    );
  });
};

export const isFolder = (targetPath: string): boolean => {
  return fs.lstatSync(path.resolve(targetPath)).isDirectory();
};

export const exists = (targetPath: string): boolean => {
  return fs.existsSync(path.resolve(targetPath));
};

export const isJSON = (data: string): boolean => {
  try {
    JSON.parse(data);
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteFolderContents = async (
  targetPath: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (exists(targetPath)) {
      readDir(targetPath).then((list: string[]) => {
        for (let folder of list) {
          deleteFolder(`${targetPath}/${folder}`);
        }
        resolve(true);
      });
    } else reject(false);
  });
};

export const deleteFolder = async (targetPath: string): Promise<boolean> => {
  try {
    fs.rmSync(path.resolve(targetPath), { recursive: true, force: true });
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteFile = async (
  targetPath: string
): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    fs.unlink(path.resolve(targetPath), (err: any) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

export const lastInPath = (filePath: string) =>
  filePath.substring(filePath.lastIndexOf(path.sep) + 1);

export const getParentPath = () => {
  return path.resolve("../");
};
