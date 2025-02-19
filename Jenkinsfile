pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "your-registry/app:latest"
        DOCKER_REGISTRY = "your-registry"
        MANIFEST_REPO = "git@github.com:your-org/app-manifest-repo.git"
        ARGOCD_APP = "your-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'github-cred', url: 'https://github.com/RaamHorakeri/simple-calculator.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $DOCKER_IMAGE ."
                }
            }
        }

        stage('Push to Docker Registry') {
            steps {
                withDockerRegistry([credentialsId: 'docker-cred', url: "https://$DOCKER_REGISTRY"]) {
                    sh "docker push $DOCKER_IMAGE"
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    sh """
                    git clone $MANIFEST_REPO
                    cd app-manifest-repo
                    sed -i 's|image:.*|image: $DOCKER_IMAGE|' values.yaml
                    git config user.email "ci-bot@example.com"
                    git config user.name "CI Bot"
                    git add values.yaml
                    git commit -m "Updated image to $DOCKER_IMAGE"
                    git push origin main
                    """
                }
            }
        }

        stage('Deploy via ArgoCD') {
            steps {
                sh "argocd app sync $ARGOCD_APP"
            }
        }
    }
}
