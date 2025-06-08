#!/bin/bash

NAMESPACE="${NAMESPACE:-cerberus}"

# Create Keycloak realm configmap
kubectl create configmap keycloak-realm \
  --from-file=cerberus-realm.json=../keycloak/config/cerberus-realm-setup.json \
  --namespace="$NAMESPACE"

# Create Keycloak profile configmap
kubectl create configmap keycloak-profile \
  --from-file=user-profile.json=../keycloak/config/user-profile.json \
  --namespace="$NAMESPACE"

# Create Quartz init script configmap
kubectl create configmap quartz-init-script \
  --from-file=1-init-quartz.sql=../init-db/1-init-quartz.sql \
  --namespace="$NAMESPACE"

echo "ConfigMaps created in namespace $NAMESPACE"
