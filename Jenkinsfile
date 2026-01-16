pipeline {
  agent any

  environment {
    AWS_REGION    = "ap-south-1"
    ECR_REGISTRY  = "743296984102.dkr.ecr.ap-south-1.amazonaws.com"
    ECR_REPO      = "myproject-app"
    KUBE_NAMESPACE = "ecommerce"
    IMAGE_TAG     = "${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          docker build \
            -t ${ECR_REPO}:${IMAGE_TAG} \
            -f product-service/Dockerfile product-service
        '''
      }
    }

    stage('Login to AWS ECR') {
      steps {
        withCredentials([
          [$class: 'AmazonWebServicesCredentialsBinding',
           credentialsId: 'aws-jenkins',
           accessKeyVariable: 'AWS_ACCESS_KEY_ID',
           secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
        ]) {
          sh '''
            aws ecr get-login-password --region ${AWS_REGION} \
            | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          '''
        }
      }
    }

    stage('Tag & Push Image') {
      steps {
        sh '''
          docker tag ${ECR_REPO}:${IMAGE_TAG} \
            ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}

          docker push ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
        '''
      }
    }

    stage('Deploy Stable') {
      steps {
        sh '''
          sed -i "s/IMAGE_TAG/${IMAGE_TAG}/g" k8s/product-stable.yaml
          kubectl apply -f k8s/product-stable.yaml -n ${KUBE_NAMESPACE}
        '''
      }
    }

    stage('Deploy Canary') {
      steps {
        sh '''
          sed -i "s/IMAGE_TAG/${IMAGE_TAG}/g" k8s/product-canary.yaml
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
