pipeline {
  agent any

  environment {
    KUBE_NAMESPACE = "ecommerce"
    ECR_REPO = "743296984102.dkr.ecr.ap-south-1.amazonaws.com/myproject-app"
    GIT_SSH_CREDENTIALS = "MylinuxmintVMkey-updated" // 
    REPO_URL = "git@github.com:nthomas013/Microservice-Architecture-project4.git" // 
    BRANCH = "main"
  }

  stages {

    stage('Build & Push Image') {
      steps {
        // Use AWS credentials stored in Jenkins
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: 'aws-ecr-push' 
        ]]) {
          sh '''
            echo "Logging into AWS ECR..."
            aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${ECR_REPO%/*}

            echo "Building Docker image..."
            docker build -t product-service:${BUILD_NUMBER} -f product-service/Dockerfile product-service

            echo "Tagging Docker images..."
            docker tag product-service:${BUILD_NUMBER} ${ECR_REPO}:${BUILD_NUMBER}
            docker tag product-service:${BUILD_NUMBER} ${ECR_REPO}:stable-${BUILD_NUMBER}
            docker tag product-service:${BUILD_NUMBER} ${ECR_REPO}:canary-${BUILD_NUMBER}

            echo "Pushing Docker images to ECR..."
            docker push ${ECR_REPO}:${BUILD_NUMBER}
            docker push ${ECR_REPO}:stable-${BUILD_NUMBER}
            docker push ${ECR_REPO}:canary-${BUILD_NUMBER}
          '''
        }
      }
    }

    stage('Git Commit & Push (Optional)') {
      when {
        expression { return fileExists('k8s/product-stable.yaml') }
      }
      steps {
        sshagent([env.GIT_SSH_CREDENTIALS]) {
          sh '''
            git config --global user.email "jenkins@example.com"
            git config --global user.name "Jenkins CI"
            git add k8s/*.yaml
            git commit -m "Update Kubernetes manifests for build ${BUILD_NUMBER}" || echo "No changes to commit"
            git push ${REPO_URL} ${BRANCH}
          '''
        }
      }
    }

    stage('Deploy Stable') {
      steps {
        sh '''
          sed -i "s/IMAGE_TAG/stable-${BUILD_NUMBER}/g" k8s/product-stable.yaml
          kubectl apply -f k8s/product-stable.yaml -n ${KUBE_NAMESPACE}
        '''
      }
    }

    stage('Deploy Canary') {
      steps {
        sh '''
          sed -i "s/IMAGE_TAG/canary-${BUILD_NUMBER}/g" k8s/product-canary.yaml
          kubectl apply -f k8s/product-canary.yaml -n ${KUBE_NAMESPACE}
        '''
      }
    }

    stage('Wait & Verify') {
      steps {
        sh '''
          sleep 60
          kubectl rollout status deployment/product-canary -n ${KUBE_NAMESPACE}
        '''
      }
    }

    stage('Manual Approval') {
      steps {
        input message: 'Promote Canary to Stable?', ok: 'Promote'
      }
    }

    stage('Promote Canary') {
      steps {
        sh '''
          kubectl scale deployment product-stable --replicas=0 -n ${KUBE_NAMESPACE}
          kubectl scale deployment product-canary --replicas=3 -n ${KUBE_NAMESPACE}
        '''
      }
    }
  }
}
