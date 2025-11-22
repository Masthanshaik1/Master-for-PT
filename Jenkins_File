pipeline {
    agent any

    environment {
        IMAGE_NAME = 'chanduyadav143/jmetertest:v1.0'  // Your Docker image name
        TEST_REPO = 'https://github.com/chanduyadav143/JMeter-Scripts.git'  // Your GitHub repo URL
    }

    stages {
        stage('Checkout Tests') {
            steps {
                // Clone your test scripts repository with credentials
                git branch: 'main', credentialsId: "${params.gitCredentialsID}", url: "${TEST_REPO}"
            }
        }
        
        stage('Run JMeter Tests') {
            steps {
                // Use bat instead of sh and adjust volume mount for Windows PowerShell syntax
                bat """
                docker run --rm -v %cd%\\JMX_Files:/tests -w /tests ${IMAGE_NAME} ^
                -n -t Sample.jmx -l results.jtl
                """
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'JMX_Files/results.jtl, report/**', allowEmptyArchive: true
            }
        }
    }
}
