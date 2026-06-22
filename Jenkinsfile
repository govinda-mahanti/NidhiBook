pipeline {
agent any


stages {

    stage('Build Containers') {
        steps {
            dir('/home/ubuntu/apps/NidhiBook') {
                sh 'docker compose build'
            }
        }
    }

    stage('Deploy Containers') {
        steps {
            dir('/home/ubuntu/apps/NidhiBook') {
                sh 'docker compose up -d'
            }
        }
    }

    stage('Cleanup Docker Images') {
        steps {
            sh 'docker image prune -f'
        }
    }
}


}
