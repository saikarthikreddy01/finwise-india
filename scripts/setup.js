import { randomBytes } from "node:crypto";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFiles = [
  { sample: "server/.env.example", target: "server/.env", server: true },
  { sample: "client/.env.example", target: "client/.env", server: false }
];

for (const { sample, target, server } of envFiles) {
  const targetPath = path.join(root, target);
  try {
    await readFile(targetPath);
    console.log(`Keeping existing ${target}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;

    await copyFile(path.join(root, sample), targetPath);
    if (server) {
      const contents = await readFile(targetPath, "utf8");
      const secret = randomBytes(48).toString("base64url");
      await writeFile(
        targetPath,
        contents.replace(
          /^JWT_SECRET=.*$/m,
          `JWT_SECRET=${secret}`
        ),
        "utf8"
      );
    }
    console.log(`Created ${target} from ${sample}`);
  }
}

console.log("Setup complete. Start MongoDB, then run npm run dev.");
