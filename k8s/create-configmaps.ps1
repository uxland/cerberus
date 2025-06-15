# Use NAMESPACE env variable or default to "cerberus"
$namespace = $env:NAMESPACE
if (-not $namespace -or $namespace -eq "") {
    $namespace = "cerberus"
}

# Create Keycloak realm configmap
kubectl create configmap keycloak-realm `
  --from-file=cerberus-realm.json=../keycloak/config/cerberus-realm-setup.json `
  --namespace=$namespace

# Create Keycloak profile configmap
kubectl create configmap keycloak-profile `
  --from-file=user-profile.json=../keycloak/config/user-profile.json `
  --namespace=$namespace

# Create Quartz init script configmap
kubectl create configmap quartz-init-script `
  --from-file=1-init-quartz.sql=../init-db/1-init-quartz.sql `
  --namespace=$namespace

Write-Host "ConfigMaps created in namespace $namespace"
