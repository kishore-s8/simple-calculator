pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'web-calculator'
        DOCKER_REPO = 'raam2023'
        GIT_COMMIT = "${env.GIT_COMMIT}"
        SONARQUBE_URL = 'http://your-sonarqube-url'
        SONARQUBE_CREDENTIALS_ID = 'your-sonarqube-credentials-id'
        KUBECONFIG = '/path/to/your/kubeconfig' // Adjust path to your Kubeconfig
    }

    stages {
        stage('Checkout SCM') {
            steps {
                script {
                    checkout scm
                    env.GIT_COMMIT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh 'mvn sonar:sonar -Dsonar.projectKey=your-project-key -Dsonar.host.url=$SONARQUBE_URL -Dsonar.login=$SONARQUBE_CREDENTIALS_ID'
                }
            }
        }

        stage('Build Code') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    def imageTag = "${DOCKER_REPO}/${DOCKER_IMAGE}:${env.GIT_COMMIT}"
                    sh "docker build -t ${imageTag} ."
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    sh "docker push ${imageTag}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig([credentialsId: 'your-kubeconfig-credentials-id', serverUrl: 'https://your-k8s-api-server']) {
                        sh "kubectl set image deployment/web-calculator-deployment web-calculator=${DOCKER_REPO}/${DOCKER_IMAGE}:${env.GIT_COMMIT} --record"
                        sh 'kubectl rollout status deployment/web-calculator-deployment'
                    }
                }
            }
        }
    }
}

