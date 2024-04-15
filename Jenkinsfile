library changelog: false, identifier: "gebit-jenkins@${GEBIT_BUILD_BRANCH}"

def projectId = env.gitlabMergeRequestTargetProjectId
def mergeRequestId = env.gitlabMergeRequestIid
if (env.gitlabActionType) {
    withCredentials([string(credentialsId: 'gitlab_token', variable: 'GITLAB_TOKEN'), string(credentialsId: 'openai-api', variable: 'OPENAI_API_KEY')]) {
        buildSimplePipeline(this) {
            stage('Checkout') {
                checkoutProject()
            }
            stage('Loading variables') {
                println "Available variables:"
                env.getEnvironment().each {k,v->
                    println "$k=$v"
                }
                println "Loaded variables: projectId: ${projectId}, mergeRequestId: ${mergeRequestId}"
                def abort = false
                if (projectId == null) {
                    println "No project id found"
                    abort = true
                }
                if (mergeRequestId == null) {
                    println "No merge request id found"
                    abort = true
                }
                if (env.GITLAB_TOKEN == null || env.GITLAB_TOKEN == '') {
                    println "No gitlab token found"
                    abort = true
                } else {
                    println "Loaded gitlab token!"
                }
                def openAI_apiKey = env.OPENAI_API_KEY
                if (openAI_apiKey == null) {
                    println "No openAI api key found"
                    abort = true
                }
                if (abort) {
                    currentBuild.result = 'ABORTED'
                    return
                }
            }
            stage('Build') {
                println 'building...'
                sh """
                    cd packages/code-review-gpt
                    npm install
                    npm run review -- --remoteGitlabProjectId=$projectId --remoteGitlabMergeId=$mergeRequestId --remoteHostUrl=https://gitlab.local.gebit.de/ --comment
                    """
            }
        }
    }
} else {
    println "This job can't be triggered manually."
    currentBuild.result = 'ABORTED'
    return
}

