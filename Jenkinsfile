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
            def currentDir = new File('.')
            def files = currentDir.listFiles().findAll { it.isFile() }
            files.each { println it.name }
            if (projectId == "") {
                println "No project id found"
                currentBuild.result = 'ABORTED'
                return
            }
            if (mergeRequestId == "") {
                println "No merge request id found"
                currentBuild.result = 'ABORTED'
                return
            }
            def gitlab_token = System.getenv("gitlab_token")
            if (gitlab_token == "") {
                println "No gitlab token found"
                currentBuild.result = 'ABORTED'
                return
            }
            def openAI_apiKey = System.getenv("OPENAI_API_KEY")
            if (openAI_apiKey == "") {
                println "No openAI api key found"
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

