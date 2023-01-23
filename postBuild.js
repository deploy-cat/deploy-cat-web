import { readFile, writeFile } from "fs/promises";

const path = `./dist/server.js`;
const code = (await readFile(path)).toString();

const transformed = code
  .replaceAll(/process\.env\.(\w+)/gi, (match, g1) => `Deno.env.get('${ g1 }')`)
  .replaceAll(/import \* as ([\w\$_-]+) from 'crypto';/gi, (match, g1) => `const ${ g1 } = crypto;`)
  .replaceAll(/import {([\w, ]+)} from 'crypto';/gi, (match, g1) => `const {${ g1 }} = crypto;`);

await writeFile(path, transformed);
