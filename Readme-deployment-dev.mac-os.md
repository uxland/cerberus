# Cerberus Platform – Developer Quickstart (k3d + Skaffold)

A fast and simple Kubernetes dev environment for Cerberus, using [k3d](https://k3d.io/) and [Skaffold](https://skaffold.dev/).

---

## Prerequisites

- [Docker](https://www.docker.com/)
- [minikube](https://minikube.sigs.k8s.io/)  
  Install via [Homebrew](https://brew.sh/):  
  `brew install minikube`  
  Or see [minikube install docs](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Skaffold](https://skaffold.dev/docs/install/)



· kubectl is the command-line tool for interacting with Kubernetes clusters.
```bash
   brew install kubectl 
```
· start minikube with the Docker driver:
```bash
   minikube start --driver=docker
```
· Enable the Ingress addon in minikube:
```bash
   minikube addons enable ingress
```

· Helm is a package manager for Kubernetes, which simplifies the deployment of applications.  
Install via [Homebrew](https://brew.sh/):
  ```bash 
  brew install helm
    ```
  Or see [Helm install docs](https://helm.sh/docs/intro/install/)
  ````
---

· Skaffold is a command-line tool that facilitates continuous development for Kubernetes applications.  
It automates the workflow for building, testing, and deploying applications to Kubernetes clusters.  
Install via [Homebrew](https://brew.sh/):
  ```bash
  brew install skaffold
  ```
Or see [Skaffold install docs](https://skaffold.dev/docs/install/)

· install traefik with helm:
```bash
helm repo add traefik https://traefik.github.io/charts
helm repo update
helm install traefik traefik/traefik --namespace kube-system --create-namespace
```


## 1. Create a Local Directory for Shared Storage

Before creating your cluster, please create a directory on your host machine that will be used for shared persistent storage by both the API and Media Server.

```bash
mkdir -p ~/cerberus/media 
```

## 2. Create the k3d Cluster

Open your terminal and run:

install cert-manager:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
```

create the namespace:

```bash
kubectl create namespace cerberus
```

enable Certificates

```bash
  kubectl apply -f k8s/base/certs-manager/credentials.yaml 
  kubectl apply -f k8s/base/certs-manager/cluster-issuer.yaml
  kubectl apply -f k8s/base/certs-manager/certificate.yaml
```

Create configmaps for postgres and keycloak initialization:

```bash
    chmod +x ./k8s/create-configmaps.sh
  ./k8s/create-configmaps.sh
````

## 3. Update Your `/etc/hosts`

Add these lines to your `/etc/hosts` file:

<pre>
127.0.0.1 keycloak.glaux-serverus.eu
127.0.0.1 api.glaux-serverus.eu
127.0.0.1 ui.glaux-serverus.eu
127.0.0.1 media.glaux-serverus.eu
</pre>

> **Note for Windows users:**  
> You will need to edit `C:\Windows\System32\drivers\etc\hosts` as an administrator.

---

## 4. Start the Development Environment


Start minikube tunneling:

```bash 
minikube tunnel
```

In your project root, launch the development environment with Skaffold by running:

```bash
skaffold dev --profile local
```

## 5. Access Your Services

Once your development environment is running, you can access the main Cerberus services in your browser.  
If you receive a warning about self-signed certificates, it is safe to proceed in this development environment.

- **API:** [https://api.glaux-serverus.eu:8443](https://api.glaux-serverus.eu:8443)
- **UI:** [https://ui.glaux-serverus.eu:8443](https://ui.glaux-serverus.eu:8443)
- **Keycloak:** [https://keycloak.glaux-serverus.eu:8443](https://keycloak.glaux-serverus.eu:8443)
- **Media Server:** [https://media.glaux-serverus.eu:8443](https://media.glaux-serverus.eu:8443)

## 6. Tear Down the Cluster (Optional)

When you are finished with your development session, you can easily remove the k3d cluster to free up system resources.  
Simply run the following command:

```bash
k3d cluster delete cerberus
```