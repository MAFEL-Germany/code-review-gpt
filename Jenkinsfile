library changelog: false, identifier: "gebit-jenkins@${GEBIT_BUILD_BRANCH}"

if (env.gitlabActionType) {
    buildSimplePipeline(this) {
        stage('Checkout') {
            checkoutProject()
        }
        stage('Loading variables') {
            def projectId = env.project.id
            def mergeRequestId = env.object_attributes.iid
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
            withCredentials([string(credentialsId: 'gitlab_token', variable: 'gitlab_token')]) {
                if (env.gitlab_token == null) {
                    println "No gitlab token found"
                    abort = true
                } else {
                    println "Loaded gitlab token!"
                }
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
            def command = "npm install"
            def workingDir = new File("packages/code-review-gpt")
            def processBuilder = new ProcessBuilder(command)
            processBuilder.directory(workingDir)
            def process = processBuilder.start()
            process.waitFor()
            println process.in.text
        }
    }
} else {
    println "This job can't be triggered manually."
    currentBuild.result = 'ABORTED'
    return
}

