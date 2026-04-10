# Kubernetes Manifests
#
# Structure (Kustomize-based):
#   base/                    — Base manifests (Deployment, Service, Ingress)
#   overlays/dev/            — Dev overrides (replica count, resource limits)
#   overlays/prod/           — Prod overrides (HPA, higher resources)
#
# Apply:
#   kubectl apply -k k8s/overlays/dev
#   kubectl apply -k k8s/overlays/prod
