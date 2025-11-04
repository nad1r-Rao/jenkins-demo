pipeline {
  agent any

  environment {
    IMAGE_NAME = "nadir468/jenkins-demo"
    DOCKERHUB_CRED = "dockerhub-creds"
    APP_PORT = "3000"
    CONTAINER_NAME = "jenkins-demo-app"
  }

  stages {
    stage("Checkout") {
      steps { checkout scm }
    }

    stage("Install & Test") {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app node:20-alpine \
            sh -lc "npm ci && npm test"
        '''
      }
    }

    stage("Build Image") {
      steps {
        sh '''
          docker build -t $IMAGE_NAME:$BUILD_NUMBER .
          docker tag  $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest
        '''
      }
    }

    stage("Push to Docker Hub") {
      steps {
        withCredentials([usernamePassword(credentialsId: DOCKERHUB_CRED, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE_NAME:$BUILD_NUMBER
            docker push $IMAGE_NAME:latest
            docker logout
          '''
        }
      }
    }

    stage("Deploy (Same Host)") {
      steps {
        sh '''
          docker rm -f $CONTAINER_NAME || true
          docker run -d --name $CONTAINER_NAME --restart unless-stopped \
            -p ${APP_PORT}:3000 $IMAGE_NAME:$BUILD_NUMBER
        '''
      }
    }
  }

  post {
    success {
      echo "Deployed: http://localhost:${APP_PORT}"
    }
  }
}
