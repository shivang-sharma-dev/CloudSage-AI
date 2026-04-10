# Helm Charts
#
# cloudsage/        — Helm chart for full CloudSage AI stack
#
# Usage:
#   helm install cloudsage ./helm/cloudsage \
#     --set backend.image.tag=latest \
#     --set backend.env.ANTHROPIC_API_KEY=sk-ant-xxx \
#     --namespace cloudsage --create-namespace
