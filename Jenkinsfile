pipeline {
    agent any

    stages {

        stage('Prepare Environment') {
            steps {
                sh 'cp /home/ubuntu/apps/NidhiBook/Backend/.env Backend/.env'
            }
        }

        stage('Build Containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Cleanup Docker Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}