## Prerequisites
 - [Docker](https://www.docker.com/) or [OrbStack](https://www.orbstack.com/)
 - [kubectl](https://kubernetes.io/docs/tasks/tools/) or
    
 - ``` bash  
        brew install kubectl ```
- [Helm](https://helm.sh/docs/intro/install/)  
    Install via [Homebrew](https://brew.sh/):  
    ```bash
    brew install helm
    ```
  - [Skaffold](https://skaffold.dev/docs/install/)  
    Install via [Homebrew](https://brew.sh/):  
    ```bash
    brew install skaffold
    ```
    
verify installation:
```bash
kubectl version --client
minikube version
helm version
skaffold version
```

## 1. Start Minikube


```bash
minikube start
```
## 2. Enable Tunneling

```bash 
minikube tunnel
```

## 3. Enable Ingress Addon

```bash 
minikube addons enable ingress
```

## 4. Install cert-manager

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
```

## 5. Create the namespace

```bash 
kubectl create namespace cerberus
```

## 6. Enable Certificates

```bash
  kubectl apply -f k8s/base/certs-manager/credentials.yaml 
  kubectl apply -f k8s/base/certs-manager/cluster-issuer.yaml
  kubectl apply -f k8s/base/certs-manager/certificate.yaml
```

## 7. Create configmaps for postgres and keycloak initialization:

```bash
    chmod +x ./k8s/create-configmaps.sh
  ./k8s/create-configmaps.sh
````

## 8. Update Your `/etc/hosts`

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
## 9. Start the Development Environment


Start minikube tunneling:

```bash 
minikube tunnel
```

In your project root, launch the development environment with Skaffold by running:

```bash
skaffold dev --profile local
```

## 10. Access Your Services

Once your development environment is running, you can access the main Cerberus services in your browser.  
If you receive a warning about self-signed certificates, it is safe to proceed in this development environment.

- **API:** [https://api.glaux-serverus.eu](https://api.glaux-serverus.eu)
- **UI:** [https://ui.glaux-serverus.eu](https://ui.glaux-serverus.eu)
- **Keycloak:** [https://keycloak.glaux-serverus.eu](https://keycloak.glaux-serverus.eu)
- **Media Server:** [https://media.glaux-serverus.eu](https://media.glaux-serverus.eu)

## Troubleshooting:

One source of conflict is the tls certs issued by the cert-manager.

# List Certificates:
```bash 
kubectl get certificates -n cerberus
```
Look for READY status as True for all:
•	cerberus-ui-tls
•	cerberus-back-tls
•	media-server-tls
•	keycloak-tls

Usually the issue is about coreDNS not being able to resolve the external domain names.
## 1Get minikube coredns.yaml from the repo 
```bash
kubectl -n kube-system get configmap coredns -o yaml > coredns.yaml
```
## 2 Change the file
forward . /etc/resolv.conf
to
forward . 8.8.8.8

check your minikube IP:
```bash
minikube ip
```
modify etc hosts to point servies to minikube IP:
<pre>
{minikube-ip} keycloak.glaux-serverus.eu
{minikube-ip} api.glaux-serverus.eu
{minikube-ip} ui.glaux-serverus.eu
{minikube-ip} media.glaux-serverus.eu
</pre>

add minikube IP to the file:
```yaml
  hosts {
  hosts {
  0.250.250.254 host.minikube.internal
  192.168.49.2 keycloak.glaux-serverus.eu
  fallthrough
  }
  ```

## 3 Apply the changes:
```bash
kubectl -n kube-system apply -f coredns.yaml
```
## Restart the coredns pods:
```bash
kubectl -n kube-system rollout restart deployment coredns
```