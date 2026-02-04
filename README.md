**1. Project Overview**

CashSwap is a simple money exchange platform where users can:

Login using OTP

Register their profile

Create money “Need Cash / Have Cash” requests

View and filter all public requests

**2. Architecture Overview**

<img width="2908" height="4088" alt="image" src="https://github.com/user-attachments/assets/a83fbb68-3b0c-464f-8d72-a61113fe3f5b" />

**3. Tech Stack**

| Layer         | Technology          |
| ------------- | ------------------- |
| Frontend      | React, Axios, NGINX |
| Backend       | Node.js, Express    |
| Auth          | OTP (Demo: 123456)  |
| API           | AWS Lambda          |
| DB            | DynamoDB            |
| Container     | Docker              |
| Orchestration | Kubernetes          |
| Autoscaling   | HPA (CPU-based)     |
| Monitoring    | Prometheus, Grafana |
| CI/CD         | GitHub Actions      |

**4. How to Deploy on Kubernetes**

Step 1: Create Kubernetes Cluster

Provision EC2 instances (1 Master, 1+ Worker)

Install Docker, kubeadm, kubelet, kubectl

Initialize cluster using kubeadm

Step 2: Deploy Backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml


Backend exposed via:

http://<NODE-IP>:30080

Step 3: Deploy Frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml


Frontend exposed via:

http://<NODE-IP>:30081

Step 4: Verify Pods & Services
kubectl get pods
kubectl get svc

**5. CI/CD Workflow (GitHub Actions + Docker Hub)**

CI/CD Flow

Code pushed to main branch

GitHub Actions workflow triggers

Docker images built using --no-cache

Images pushed to Docker Hub

Kubernetes pulls latest images

Docker Images
Service	Image
Frontend	shaiksahil123/moneyswapfrontend:latest
Backend	shaiksahil123/moneyswapbackend:latest

**6. HPA + Load Testing**

Horizontal Pod Autoscaler (HPA)

HPA configured for Frontend

Scales pods based on CPU utilization

Automatically increases/decreases replicas

Example:

kubectl autoscale deployment frontend --cpu-percent=20 --min=1 --max=10

Load Testing

Load generated using BusyBox:

kubectl run loadgen --image=busybox --restart=Never -- \
sh -c "while true; do wget -q -O- http://frontend-service; done"

Observed Behavior:

CPU usage increases

HPA scales frontend pods

Pods scale down after load stops

**7. Monitoring Setup (Prometheus + Grafana)**

Tools Used

Prometheus (metrics collection)

Grafana (visualization)

Installed Using Helm

kube-prometheus-stack

Grafana exposed via NodePort

Access Grafana:

http://<NODE-IP>:32000

Metrics Monitored

Pod CPU usage

Pod memory usage

HPA scaling events

Node health

**8. Screenshots & Results**

Screenshots Included:

**Kubernetes pods scaling up/down**

**HPA status**
<img width="1324" height="84" alt="image" src="https://github.com/user-attachments/assets/b68ed3c2-9f44-4f14-bf0e-39514ee88040" />


**Grafana dashboards**
<img width="1920" height="894" alt="image" src="https://github.com/user-attachments/assets/bc1801e1-2ef6-4024-83fb-670f6a3978b8" />


**Frontend UI**
<img width="1920" height="888" alt="image" src="https://github.com/user-attachments/assets/2a227671-7a1e-47bf-b1aa-8f5eedf0a72c" />
<img width="1920" height="901" alt="image" src="https://github.com/user-attachments/assets/c40580f7-ffaf-49f5-8c95-ba0e5c870a8f" />
<img width="1920" height="876" alt="image" src="https://github.com/user-attachments/assets/04d6c263-f694-4a83-8c87-a217b22e54fb" />
<img width="1920" height="892" alt="image" src="https://github.com/user-attachments/assets/7ed1090d-9107-4746-a797-fb9fca19c4bf" />
<img width="1920" height="896" alt="image" src="https://github.com/user-attachments/assets/15a7ac06-4f1e-4f33-b4ed-d6baa74d2056" />
<img width="1920" height="905" alt="image" src="https://github.com/user-attachments/assets/2c4109ca-d492-4af3-96e6-675fa16d9898" />
<img width="1911" height="897" alt="image" src="https://github.com/user-attachments/assets/4015cf7b-149d-418a-851a-4b204b364c86" />





**GitHub Actions pipeline success**
<img width="1920" height="886" alt="image" src="https://github.com/user-attachments/assets/87d0f0b0-0b3c-4538-b287-431c58691635" />


**Docker Hub images**
<img width="1920" height="887" alt="image" src="https://github.com/user-attachments/assets/60bf06b1-9ff9-4a1e-b23e-662e3388ff22" />


**Results:**

**Successful autoscaling**
<img width="924" height="291" alt="image" src="https://github.com/user-attachments/assets/8f6bb1de-a7f9-4488-b586-fe571f694cf0" />

**Metrics visible in Grafana**
<img width="1600" height="744" alt="image" src="https://github.com/user-attachments/assets/bc8b2e4e-8b4a-473a-be81-c7fe350d37cd" />
