import rawlist from "@inquirer/rawlist";
import dotenv from "dotenv";
import yargs from "yargs";

import { PlatformOptions, ReviewArgs } from "./common/types";
import { logger } from "./common/utils/logger";

dotenv.config();

const handleNoCommand = async (): Promise<string | number> => {
  const command = await rawlist({
    message: "What do you want to do?",
    choices: [
      { name: "Review staged files", value: "review" },
      {
        name: "Configure the script for CI (Recommended for first time use)",
        value: "configure",
      },
    ],
  });

  return command;
};

export const getYargs = async (): Promise<ReviewArgs> => {
  const argv = yargs
    .option("ci", {
      description:
        "Indicates that the script is running on a CI environment. Specifies which platform the script is running on, 'github' or 'gitlab'. Defaults to 'github'.",
      choices: ["github", "gitlab"],
      type: "string",
      coerce: (arg: string | undefined) => {
        return arg || "github";
      },
    })
    .option("setupTarget", {
      description:
        "Specifies for which platform ('github' or 'gitlab') the project should be configured for. Defaults to 'github'.",
      choices: ["github", "gitlab"],
      type: "string",
      default: "github",
    })
    .option("commentPerFile", {
      description:
        "Enables feedback to be made on a file-by-file basis. Only work when the script is running on GitHub.",
      type: "boolean",
      default: false,
    })
    .option("model", {
      description: "The model to use for generating the review.",
      type: "string",
      default: "gpt-4",
    })
    .option("reviewType", {
      description:
        "Type of review to perform. 'full' will review the entire file, 'changed' will review the changed lines only but provide the full file as context if possible. 'costOptimized' will review only the changed lines using the least tokens possible to keep api costs low. Defaults to 'changed'.",
      choices: ["full", "changed", "costOptimized"],
      type: "string",
      default: "changed",
    })
    .option("remote", {
      description: "The identifier of a remote GitHub Pull Request to review",
      type: "string",
      coerce: (arg: string | undefined) => {
        return arg || "";
      },
    })
    .option("remoteType", {
      description: "The type of the remote pull request. Defaults to 'github'.",
      type: "string",
      choices: ["github", "gitlab"],
      default: "github"
    })
    .option("comment", {
      description: "Should comment on remote pull request",
      type: "boolean",
      default: false
    })
    .option("remoteGitlabProjectId", {
      description: "The id of a remote GitLab project",
      type: "string",
      coerce: (arg: string | undefined) => {
        return arg || "";
      },
    })
    .option("remoteGitlabMergeId", {
      description: "The id of a remote GitLab merge request",
      type: "string",
      coerce: (arg: string | undefined) => {
        return arg || "";
      },
    })
    .option("remoteHostUrl", {
      description: "The id of a GitLab server",
      type: "string",
      coerce: (arg: string | undefined) => {
        return arg || "";
      },
    })
    .option("debug", {
      description: "Enables debug logging.",
      type: "boolean",
      default: false,
    })
    .option("org", {
      description: "Organization id to use for openAI",
      type: "string",
      default: undefined,
    })
    .option("provider", {
      description: "Provider to use for AI",
      choices: ["openai", "bedrock", "ollama"],
      type: "string",
      default: "openai",
    })
    .option("providerurl", {
      description: "Server url of provider",
      type: "string",
      default: undefined
    })
    .command("review", "Review the pull request.")
    .command("configure", "Configure the script.")
    .parseSync();

  if (!argv._[0]) {
    argv._[0] = await handleNoCommand();
  }

  if (argv.shouldCommentPerFile && !argv.isCi) {
    throw new Error(
      "The 'commentPerFile' flag requires the 'ci' flag to be set."
    );
  }

  if (argv.isCi === PlatformOptions.GITLAB && argv.shouldCommentPerFile) {
    logger.warn(
      "The 'commentPerFile' flag only works for GitHub, not for GitLab."
    );
  }

  return argv;
};
