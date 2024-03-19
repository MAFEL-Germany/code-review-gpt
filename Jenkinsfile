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
            println "Available variables:"
            def env = System.getenv()
            env.each { key, value ->
                println "$key=$value"
            }
            println "These are the current files: "
            def currentDir = new File('./')
            def files = currentDir.listFiles().findAll { it.isFile() }
            files.each { println it.name }
            def abort = false
            if (projectId == null) {
                println "No project id found"
                abort = true
            }
            if (mergeRequestId == null) {
                println "No merge request id found"
                abort = true
            }
            def gitlab_token = System.getenv("gitlab_token")
            if (gitlab_token == null) {
                println "No gitlab token found"
                abort = true
            }
            def openAI_apiKey = System.getenv("OPENAI_API_KEY")
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

