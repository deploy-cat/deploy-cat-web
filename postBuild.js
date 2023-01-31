import { readFile, writeFile } from "fs/promises";

const path = `./dist/server.js`;
const code = (await readFile(path)).toString();

const transformed = `const process = { versions: {} };
` +
  code
    .replaceAll(/process\.env\.(\w+)/gi, (match, g1) => `Deno.env.get('${g1}')`)
    .replaceAll(
      /import \* as ([\w\$_-]+) from 'crypto';/gi,
      (match, g1) =>
        `import * as ${g1} from 'https://deno.land/std/node/crypto.ts';`,
    )
    .replaceAll(
      /import {([\w, ]+)} from 'crypto';/gi,
      (match, g1) =>
        `import {${g1}} from 'https://deno.land/std/node/crypto.ts';`,
    );

await writeFile(path, transformed);
