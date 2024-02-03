import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import semver from "semver";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type IncrementType = "patch" | "minor" | "major";

// Function to read a JSON file
function readJsonFile(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading the file from disk: ${filePath}`, error);
    process.exit(1);
  }
}

// Function to write a JSON file
function writeJsonFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Beautify the JSON output
    fs.writeFileSync(filePath, jsonData, "utf8");
  } catch (error) {
    console.error(`Error writing the file to disk: ${filePath}`, error);
    process.exit(1);
  }
}

// Function to bump version
function bumpVersion(currentVersion: string, incrementType: IncrementType) {
  return semver.inc(currentVersion, incrementType);
}

// Main function to update versions
function updateVersions(incrementType: IncrementType) {
  const packagePath = path.join(__dirname, "package.json");
  const tauriConfPath = path.join(__dirname, "src-tauri", "tauri.conf.json");

  // Read current versions
  const packageJson = readJsonFile(packagePath);
  const tauriConfJson = readJsonFile(tauriConfPath);

  // Bump version
  const newVersion = bumpVersion(packageJson.version, incrementType);

  // Update versions
  packageJson.version = newVersion;
  tauriConfJson.package.version = newVersion;

  // Write updated configurations
  writeJsonFile(packagePath, packageJson);
  writeJsonFile(tauriConfPath, tauriConfJson);

  console.log(`Version updated to ${newVersion}`);
}

const incrementType = process.argv[2] as IncrementType;
updateVersions(incrementType);
