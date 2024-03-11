import { ReviewFile } from "../../types";
import { extractBaseUrl } from "./extractBaseUrl";
import { CommitDiffSchema, Gitlab } from "@gitbeaker/rest";
import { MergeRequestIdentifier } from "./types";
import { logger } from "../../utils/logger";

export const getRemotePullRequestFiles = async (
    host: string | undefined,
    projectIdString: string | undefined,
    mergeRequestIdString: string | undefined
): Promise<ReviewFile[]> => {
    if (host === undefined || projectIdString === undefined || mergeRequestIdString === undefined) {
        throw new Error("host, projectId and mergeRequestId must be defined");
    }
    const projectId = Number.parseInt(projectIdString)
    const mergeRequestId = Number.parseInt(mergeRequestIdString)
    logger.info("Getting remote pull request files with host: " + host + ", projectId: " + projectId + ", mergeRequestId: " + mergeRequestId)
    const gitlabToken = process.env.GITLAB_TOKEN ?? "";
    if (gitlabToken == "") {
        throw new Error("GITLAB_TOKEN must be defined");
    }
    const api = new Gitlab({
        host: host,
        token: gitlabToken,
      });
    const ref = await getHeadSha(api, projectId, mergeRequestId);
    logger.info("Retrieved ref: " + ref)
    const changes = await api.MergeRequests.showChanges(projectId, mergeRequestId);
    const reviewFiles = await Promise.all(changes.changes.map(async (change) => {
      return await diffSchemaToReviewFile(change, projectId, ref, api);
    }));
    logger.info("Retrieved review files: "+ reviewFiles)
    return reviewFiles;
}

const getHeadSha = async (api:any, projectId: number, mergeRequestId: number): Promise<string> => {
    const mergeRequest = await api.MergeRequests.show(projectId, mergeRequestId)
    if (mergeRequest.sha == null) {
      throw new Error("Merge request sha is null");
    }
    return mergeRequest.sha
}

const diffSchemaToReviewFile = async (diff: CommitDiffSchema, projectId: number, ref:String, api: any): Promise<ReviewFile> => {
  const file = await api.RepositoryFiles.show(projectId,diff.new_path, ref);
  if (file.content === null) {
    throw new Error("File content is null");
  }
  return {
    fileName: diff.new_path,
    changedLines: diff.diff,
    fileContent: file.content
  }
}