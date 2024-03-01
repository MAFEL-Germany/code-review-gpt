import de.gebit.build.jenkins.PipelineJobBuilder
import javaposse.jobdsl.dsl.JobParent

new PipelineJobBuilder(binding) {

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
                            secretToken('e296b73bb48b3d85d38afe8f13f67691')
                            branchFilterType('RegexBasedFilter')
                            sourceBranchRegex('feature/.*|epic/.*')
                        }
                    }
                }
            }
        }
    }
}
