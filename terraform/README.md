# Terraform — Infrastructure as Code
# 
# This directory will contain all AWS infrastructure:
#   modules/vpc/         — VPC, subnets, IGW, NAT, route tables
#   modules/ecs/         — ECS cluster, task defs, services
#   modules/rds/         — RDS PostgreSQL, subnet group, security groups
#   modules/alb/         — ALB, target groups, listeners, rules
#   modules/ecr/         — ECR repos for frontend + backend images
#   modules/secrets/     — Secrets Manager (API keys + DB creds)
#   environments/dev/    — Dev environment root module
#   environments/prod/   — Prod environment root module
#
# Setup:
#   cd environments/dev
#   terraform init
#   terraform plan
#   terraform apply
