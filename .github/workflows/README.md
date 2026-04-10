# CI/CD Pipelines — GitHub Actions
#
# Planned workflows:
#   ci.yml           — Lint + test + docker build on every PR
#   deploy-dev.yml   — Deploy to AWS dev environment on push to dev branch
#   deploy-prod.yml  — Deploy to AWS prod on push to main (requires approval)
#
# Secrets required in GitHub repo settings:
#   AWS_ACCESS_KEY_ID
#   AWS_SECRET_ACCESS_KEY
#   AWS_REGION
#   ANTHROPIC_API_KEY (or GEMINI_API_KEY)
#   ECR_REGISTRY
