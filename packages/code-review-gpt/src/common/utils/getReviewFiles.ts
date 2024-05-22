import { ReviewFile } from "../types";
import { logger } from "./logger";

export const getReviewFiles = async (
  isCi: string | undefined,
  remoteType: string | undefined,
  remotePullRequest: string | undefined,
  projectId: string | undefined,
  mergeRequestId: string | undefined,
  host: string | undefined,
): Promise<ReviewFile[]> => {
    if (remoteType == "gitlab") {
      logger.info("Using gitlab remote pull request")
      const { getRemotePullRequestFiles } = await import(
        "../remote/gitlab/getRemotePullRequestFiles"
      );
      return await getRemotePullRequestFiles(host, projectId, mergeRequestId);
    } else if (remoteType == "github") {
      logger.info("Using github remote pull request")
      const { getRemotePullRequestFiles } = await import(
        "../remote/github/getRemotePullRequestFiles"
      );
      if (remotePullRequest === undefined) {
        throw Error("remotePullRequest is undefined");
      }
      return await getRemotePullRequestFiles(remotePullRequest);
    } else {
      const { getFilesWithChanges } = await import("../git/getFilesWithChanges");

      return await getFilesWithChanges(isCi);
    }
};
