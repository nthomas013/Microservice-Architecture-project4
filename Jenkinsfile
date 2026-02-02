pipeline {
    agent any

    environment {
        REGISTRY = "192.168.1.43:8082"
        REPO     = "docker-hosted"
        IMAGE    = "myproject-app"
        TAG      = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                  echo "Building Docker image..."
                  docker build \
                    -t ${IMAGE}:${TAG} \
                    -f product-service/Dockerfile \
                    product-service
                '''
            }
        }

        stage('Tag Image for Nexus') {
            steps {
                sh '''
                  echo "Tagging image for Nexus..."
                  docker tag ${IMAGE}:${TAG} \
                    ${REGISTRY}/${REPO}/${IMAGE}:${TAG}
                '''
            }
        }

        stage('Login to Nexus') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-docker-creds',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                      echo "Logging into Nexus registry..."
                      echo "$NEXUS_PASS" | docker login ${REGISTRY} \
                        -u "$NEXUS_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Image to Nexus') {
            steps {
                sh '''
                  echo "Pushing image to Nexus..."
                  docker push ${REGISTRY}/${REPO}/${IMAGE}:${TAG}
                '''
            }
        }

        stage('Cleanup Local Images') {
            steps {
                sh '''
                  echo "Cleaning up local Docker images..."
                  docker rmi ${IMAGE}:${TAG} || true
                  docker rmi ${REGISTRY}/${REPO}/${IMAGE}:${TAG} || true
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build & Push completed successfully!"
            echo "Image: ${REGISTRY}/${REPO}/${IMAGE}:${TAG}"
        }

        failure {
            echo "❌ Pipeline failed. Check logs above."
        }

        always {
            sh 'docker system prune -f || true'
        }
    }
}
