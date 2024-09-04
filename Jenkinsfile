pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'web-calculator'
        DOCKER_REPO = 'raam2023'
        GIT_COMMIT = "${env.GIT_COMMIT}"
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
             script {
                  def scannerHome = tool 'SonarScanner';
                  withSonarQubeEnv() {
                  sh "${scannerHome}/bin/sonar-scanner"
              }
             }
         }
     }

        stage('Build Code') {
            steps {
                tool name: 'NodeJS', type: 'NodeJSInstallation'
                script {
                sh 'npm install'
                sh 'npm run build'
            }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    def imageTag = "${DOCKER_REPO}/${DOCKER_IMAGE}:${env.GIT_COMMIT}"
                    sh "docker build -t ${imageTag} ."
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                    sh "docker push ${imageTag}"
                    }

                }
            }
        }

        // stage('Deploy to Kubernetes') {
        //     steps {
        //         script {
        //             withKubeConfig([credentialsId: 'your-kubeconfig-credentials-id', serverUrl: 'https://your-k8s-api-server']) {
        //                 sh "kubectl set image deployment/web-calculator-deployment web-calculator=${DOCKER_REPO}/${DOCKER_IMAGE}:${env.GIT_COMMIT} --record"
        //                 sh 'kubectl rollout status deployment/web-calculator-deployment'
        //             }
        //         }
        //     }
        // }
    }
}

