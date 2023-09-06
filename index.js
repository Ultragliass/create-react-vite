#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

async function createProject() {
  const { folderName } = await inquirer.prompt([
    {
      type: "input",
      name: "folderName",
      message: "Enter your project's folder name:",
    },
  ]);

  if (!folderName.trim()) {
    console.log("\x1b[32m%s\x1b[0m", "Folder name cannot be empty");

    process.exit(1);
  }

  const projectPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "template"
  );

  const projectFolder = path.join(process.cwd(), folderName);

  try {
    console.log("\x1b[32m%s\x1b[0m", "Creating folder...");

    await fs.copy(projectPath, projectFolder);

    console.log("\x1b[32m%s\x1b[0m", "Installing dependencies...");

    await execa("npm", ["install", "--production=false"], {
      cwd: projectFolder,
      stdio: "inherit",
    });

    console.log("\x1b[32m%s\x1b[0m", "Initializing git...");

    await execa("git", ["init", "-q"], {
      cwd: projectFolder,
      stdio: "inherit",
    });

    await execa("git", ["add", "."], {
      cwd: projectFolder,
      stdio: "inherit",
    });

    await execa("git", ["commit", "-m", `"Initialize project"`], {
      cwd: projectFolder,
      stdio: "inherit",
    });

    console.log("\x1b[32m%s\x1b[0m", "Happy hacking!");
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

createProject();
