pipeline {
    agent any

    stages {

        stage('Build Containers') {
            steps {
                dir('/home/ubuntu/apps/NidhiBook') {
                    sh 'git pull origin main'
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
    }
}
