/* Extract a legal .docx into an HTML fragment for content/legal/.
   Usage: node scripts/legal/extract.mjs "<input.docx>" "<output.html>"

   Deliberately minimal: mammoth's semantic HTML output, no post-processing
   that could alter legal wording. Inspect the output by eye and with the
   plain-text diff in scripts/legal/check.mjs before freezing a version file. */
import mammoth from "mammoth";
import fs from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input) {
  console.error("usage: node scripts/legal/extract.mjs <input.docx> [output.html]");
  process.exit(1);
}

const result = await mammoth.convertToHtml({ path: input });
for (const m of result.messages) console.error(`[mammoth] ${m.type}: ${m.message}`);

if (output) {
  fs.writeFileSync(output, result.value);
  console.log(`wrote ${output} (${result.value.length} bytes)`);
} else {
  process.stdout.write(result.value);
}
