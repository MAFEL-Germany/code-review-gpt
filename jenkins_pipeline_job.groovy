import de.gebit.build.jenkins.PipelineJobBuilder
import javaposse.jobdsl.dsl.JobParent

def builder = new PipelineJobBuilder(binding) {

    @Override
    protected void doBuildBranch(JobParent jobParent, String gitbranch, String branchType, String branch) {
        jobTypes = ['job']
        super.doBuildBranch(jobParent, gitbranch, branchType, branch)
    }

    @Override
    protected void configureGitLab(String branchType, String jobType) {
        job.with {
            properties {
                gitLabConnection {
                    gitLabConnection(jobProperties.gitLabConnection)
                }
            }
        }
    }

    @Override
    protected void configureJobTrigger(String jenkinsFolder, String jobType, String branch, String branchType) {
        job.with {
            description("""Code Review GPT job uses Large Language Models to review code in your merge requests. It helps streamline the code review process by providing feedback on code that may have issues or areas for improvement.

This job will be triggered only by a GitLab Merge Request Events (opened, commented) and can't be triggered manually.

In order to enable Code Review GPT for a project, a Webhook should be configured for the project in GitLab (Settings -> Webhooks) with following parameters:
- URL: ${jobProperties['JENKINS_URL']}project/${jobProperties['JOB_NAME']}
- Secret Token: ${jobProperties.customProperties['WEBHOOK_SECRET']}
- Trigger: Comments, Merge request events""")
            properties {
                pipelineTriggers {
                    triggers {
                        gitlab {
                            triggerOnPush(false)
                            triggerOnApprovedMergeRequest(false)
                            triggerOnPipelineEvent(false)
                            triggerToBranchDeleteRequest(false)
                            
                            triggerOnMergeRequest(true)
                            triggerOnAcceptedMergeRequest(false) // merged
                            triggerOnClosedMergeRequest(false)
                            triggerOnlyIfNewCommitsPushed(false)
                            triggerOpenMergeRequestOnPush('never')
                            triggerOnNoteRequest(true)
                            noteRegex('^\\s*#(analyze|ai)\\s*$')
                            skipWorkInProgressMergeRequest(false)
                            setBuildDescription(false)
                            secretToken(jobProperties.customProperties['WEBHOOK_SECRET'])
                            branchFilterType('RegexBasedFilter')
                            sourceBranchRegex('feature/.*|epic/.*')
                        }
                    }
                }
            }
        }
    }
}

builder.computeJenkinsFolderForProject = { String project, String branch ->
    return ''
}

builder.computeJobNameForProject = { String jenkinsFolder, String project, String branch, String jobType ->
    return project
}

builder