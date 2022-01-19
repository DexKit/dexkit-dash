import fs from 'fs';

import commander from 'commander';

function addslashes(str: string) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\u0008/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

function jsonDiff(
  fromLang: {[key: string]: string},
  toLang: {[key: string]: string},
): string[] {
  const keys = [];

  for (const key of Object.keys(fromLang)) {
    if (!toLang[key]) {
      keys.push(key);
    }
  }

  return keys;
}

const program = new commander.Command();

program
  .version('0.0.1')
  .option('-f, --from <string>', 'from language')
  .option('-t, --to <string>', 'to language');

program.parse(process.argv);

const options = program.opts();

if (options.from && options.to) {
  const fromFile = JSON.parse(
    fs
      .readFileSync(`src/shared/localization/locales/${options.from}.json`)
      .toString(),
  );

  const toFile = JSON.parse(
    fs
      .readFileSync(`src/shared/localization/locales/${options.to}.json`)
      .toString(),
  );

  const diff = jsonDiff(fromFile, toFile);

  const bufferArr = [];

  for (const key of diff) {
    bufferArr.push(`"${key}": "${addslashes(fromFile[key])}"`);
  }

  const keys = bufferArr.join(',');

  console.log(`{${keys}}`);
}
