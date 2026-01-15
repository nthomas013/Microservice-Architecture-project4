pipeline {
  agent any

  environment {
    KUBE_NAMESPACE = "ecommerce"
    ECR_REPO = "<ECR_REPO>"   // keep your actual ECR repo here
  }

  stages {

    stage('Build & Push Image') {
      steps {
        sh '''
          docker build \
            -t product-service:${BUILD_NUMBER} \
            -f product-service/Dockerfile product-service

          docker tag product-service:${BUILD_NUMBER} ${ECR_REPO}:${BUILD_NUMBER}
          docker tag product-service:${BUILD_NUMBER} ${ECR_REPO}:stable-${BUILD_NUMBER}
          docker tag product-service:${BUILD_NUMBER} ${ECR_REPO}:canary-${BUILD_NUMBER}

          docker push ${ECR_REPO}:${BUILD_NUMBER}
          docker push ${ECR_REPO}:stable-${BUILD_NUMBER}
          docker push ${ECR_REPO}:canary-${BUILD_NUMBER}
        '''
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
