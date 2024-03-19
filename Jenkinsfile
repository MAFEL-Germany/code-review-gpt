library changelog: false, identifier: "gebit-jenkins@${GEBIT_BUILD_BRANCH}"

if (env.gitlabActionType) {
    buildSimplePipeline(this) {
        stage('Checkout') {
            checkoutProject()
        }
        stage('Loading variables') {
            def projectId = System.getenv('project.id')
            def mergeRequestId = System.getenv('object_attributes.iid')
            println "Loaded variables: projectId: ${projectId}, mergeRequestId: ${mergeRequestId}"
            if (projectId == "") {
                println "No project id found"
                currentBuild.result = 'FAILURE'
                return
            }
            if (mergeRequestId == "") {
                println "No merge request id found"
                currentBuild.result = 'FAILURE'
                return
            }
            def gitlab_token = System.getenv("gitlab_token")
            if (gitlab_token == "") {
                println "No gitlab token found"
                currentBuild.result = 'FAILURE'
                return
            }
            def openAI_apiKey = System.getenv("OPENAI_API_KEY")
            if (openAI_apiKey == "") {
                println "No openAI api key found"
                currentBuild.result = 'FAILURE'
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

