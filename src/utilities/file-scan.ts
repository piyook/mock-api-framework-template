import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function getApiPaths() {
  const apiFolder = `${__dirname}/../api`;

  const apiHandlers = [];

  const files = fs.readdirSync(apiFolder);

  for (const file of files) {
    const filePath = path.join(apiFolder, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Get the directory name
      console.log("Directory Name:", file);
      console.log(filePath);

      // Import index.ts file (assuming it's in each directory)
      try {
        const { default: indexFile } = await import(
          `file://${path.join(filePath, "index.ts")}`
        );
        // add new handlers to return array - remember to spread these out as may be more than one
        apiHandlers.push(...indexFile);
        // Do something with the imported file
      } catch (error) {
        console.error("Error importing index.ts file:", error);
      }
    }
  }

  return apiHandlers;
}
