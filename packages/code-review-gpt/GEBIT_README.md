# GEBIT README

Execute locally for a remote pull request:

```
npm install
npm run review -- --remoteGitlabProjectId=1390 --remoteGitlabMergeId=17 --remoteHostUrl=https://gitlab.local.gebit.de/
```

For this the gitlab access token needs to be set:
```bash
set GITLAB_TOKEN=<PASSWORD>
```