// Deterministic extraction from PDF pages rendered at 2160 × 2640.
// Usage: node frontend/scripts/extract-profile-assets.mjs /tmp
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  throw new Error("Provide the folder containing profile-page-N-final.png");
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(scriptDirectory, "../public/images/profile");
fs.mkdirSync(output, { recursive: true });
const page = (number) => path.join(source, `profile-page-${number}-final.png`);

async function mask(number, box, name, opacity) {
  const { data, info } = await sharp(page(number))
    .extract(box)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let index = 0; index < info.width * info.height; index += 1) {
    rgba[index * 4] = rgba[index * 4 + 1] = rgba[index * 4 + 2] = 255;
    rgba[index * 4 + 3] = Math.round(
      Math.max(
        0,
        Math.min(
          255,
          opacity(data[index * 3], data[index * 3 + 1], data[index * 3 + 2]),
        ),
      ),
    );
  }
  await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(path.join(output, name));
}

await mask(
  2,
  { left: 1120, top: 205, width: 385, height: 96 },
  "askara-mask.png",
  (red, _green, blue) => (red - blue - 12) * 3.6,
);
await mask(
  2,
  { left: 1120, top: 205, width: 70, height: 96 },
  "askara-mark-mask.png",
  (red, _green, blue) => (red - blue - 12) * 3.6,
);

const names = [
  "digital",
  "kolaborasi",
  "kaderisasi",
  "meritokrasi",
  "profesionalisme",
];
const positions = [294, 647, 1000, 1351, 1702];
for (let index = 0; index < names.length; index += 1) {
  await mask(
    4,
    { left: positions[index] + 18, top: 2092, width: 130, height: 145 },
    `pilar-${names[index]}.png`,
    (_red, _green, blue) => (blue - 70) * 2.3,
  );
}

await mask(
  6,
  { left: 1340, top: 1890, width: 640, height: 560 },
  "signature-mask.png",
  (red) => (185 - red) * 5,
);
await sharp(page(2))
  .extract({ left: 162, top: 1434, width: 447, height: 562 })
  .webp({ quality: 86 })
  .toFile(path.join(output, "yusuf-portrait-mono.webp"));
await sharp(page(3))
  .extract({ left: 0, top: 555, width: 2160, height: 760 })
  .resize({ width: 1440 })
  .webp({ quality: 84 })
  .toFile(path.join(output, "yusuf-gerakan.webp"));
await sharp(page(4))
  .extract({ left: 380, top: 405, width: 1110, height: 1600 })
  .resize({ width: 850 })
  .webp({ quality: 86 })
  .toFile(path.join(output, "yusuf-formal.webp"));

console.log(
  "Extracted Askara, five pillar symbols, signature, and three photos.",
);
