# GEBIT README

Execute locally for a remote pull request:

```
npm install
npm run review -- --remoteGitlabProjectId=1390 --remoteGitlabMergeId=17 --remoteHostUrl=https://gitlab.local.gebit.de/ --comment
```

For this the gitlab access token needs to be set:
```bash
GITLAB_TOKEN=<PASSWORD>
OPENAI_API_KEY=<KEY>
```

Run with ollama:
```
npm run review -- --provider=ollama --remoteGitlabProjectId=1390 --remoteGitlabMergeId=17 --remoteHostUrl=https://gitlab.local.gebit.de/ --comment
npm run review -- --provider=ollama --remote=MAFEL-Germany/autodirector#168
```