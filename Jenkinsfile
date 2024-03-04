library changelog: false, identifier: "gebit-jenkins@${GEBIT_BUILD_BRANCH}"

if (env.gitlabActionType) {
    buildSimplePipeline(this) {
        stage('Checkout') {
            checkoutProject()
        }
        stage('Build') {
            println 'building...'
        }
    }
} else {
    println "This job can't be triggered manually."
    currentBuild.result = 'ABORTED'
    return
}

