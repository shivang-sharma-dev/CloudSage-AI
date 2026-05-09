# CloudSage AI — DevOps Roadmap
### From Zero Tools → Production AWS Deployment

**OS:** Ubuntu / Debian Linux  
**Project:** Running locally via docker-compose ✅  
**Goal:** Full 3-Tier AWS deployment with Terraform + GitHub Actions CI/CD

---

## 🗺️ Overview — All 9 Phases

```
Phase 0  →  Install All DevOps Tools (AWS CLI, Terraform, Docker, Git)
Phase 1  →  Git + GitHub Setup (version control your project)
Phase 2  →  AWS Account Hardening (IAM, OIDC, billing alerts)
Phase 3  →  Terraform Remote State (S3 + DynamoDB backend)
Phase 4  →  Terraform VPC (networking foundation)
Phase 5  →  Terraform RDS (PostgreSQL in private subnet)
Phase 6  →  Terraform ECR + Push Docker Images
Phase 7  →  Terraform ECS Fargate (deploy all 3 containers)
Phase 8  →  Terraform ALB (load balancer + routing rules)
Phase 9  →  GitHub Actions CI/CD (OIDC → build → push → deploy)
```

> **Rule:** Complete each phase fully before moving to the next.  
> **Verify:** Every phase ends with a verification command to confirm it worked.

---

---

# PHASE 0 — Install All DevOps Tools

> **Goal:** Get every tool installed and verified on your Ubuntu machine.

---

## Step 0.1 — Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 0.2 — Install Git

```bash
sudo apt install git -y

# Verify
git --version
# Expected: git version 2.x.x

# Configure your identity (used in every commit)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main

# Verify config
git config --list
```

---

## Step 0.3 — Install Docker + Docker Compose

```bash
# Remove old versions if any
sudo apt remove docker docker-engine docker.io containerd runc -y

# Install dependencies
sudo apt install ca-certificates curl gnupg lsb-release -y

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repo
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Add your user to docker group (so you don't need sudo every time)
sudo usermod -aG docker $USER

# Apply group change without logout
newgrp docker

# Verify
docker --version
# Expected: Docker version 24.x.x

docker compose version
# Expected: Docker Compose version v2.x.x

# Test Docker works
docker run hello-world
```

---

## Step 0.4 — Install AWS CLI v2

```bash
# Download installer
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# Install unzip if needed
sudo apt install unzip -y

# Unzip and install
unzip awscliv2.zip
sudo ./aws/install

# Clean up
rm -rf awscliv2.zip aws/

# Verify
aws --version
# Expected: aws-cli/2.x.x Python/3.x.x Linux/x86_64
```

---

## Step 0.5 — Install Terraform

```bash
# Install HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Add HashiCorp repo
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list

# Install
sudo apt update
sudo apt install terraform -y

# Verify
terraform --version
# Expected: Terraform v1.x.x
```

---

## Step 0.6 — Install jq (JSON processor — essential for AWS CLI scripts)

```bash
sudo apt install jq -y

# Verify
jq --version
```

---

## ✅ Phase 0 Verification

Run this full check — all 5 must return versions:

```bash
echo "=== DevOps Tools Check ===" && \
git --version && \
docker --version && \
docker compose version && \
aws --version && \
terraform --version && \
jq --version && \
echo "=== All tools ready! ==="
```

---
---

# PHASE 1 — Git + GitHub Setup

> **Goal:** Push your project to GitHub with proper branch structure and .gitignore.

---

## Step 1.1 — Create GitHub Repository

1. Go to [github.com](https://github.com) → **New Repository**
2. Name: `cloudsage-ai`
3. Visibility: **Public**
4. Description: `AI-powered AWS cost optimization platform for Solutions Architects`
5. **Do NOT** initialize with README (your local project already has files)
6. Click **Create Repository**

---

## Step 1.2 — Create SSH Key for GitHub

```bash
# Generate SSH key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "you@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519

# Copy PUBLIC key to clipboard
cat ~/.ssh/id_ed25519.pub
```

Copy the output → Go to GitHub → **Settings → SSH and GPG keys → New SSH key** → Paste → Save.

```bash
# Test connection
ssh -T git@github.com
# Expected: Hi <username>! You've successfully authenticated
```

---

## Step 1.3 — Create Root .gitignore

In your project root, create `.gitignore`:

```bash
cat > .gitignore << 'EOF'
# Environment & Secrets
.env
.env.local
.env.*.local
*.tfvars
!*.tfvars.example

# Terraform
.terraform/
**/.terraform/
*.tfstate
*.tfstate.backup
*.tfstate.lock.info
.terraform.lock.hcl
crash.log

# Python
__pycache__/
*.py[cod]
.pytest_cache/
.mypy_cache/
.ruff_cache/
.venv/
venv/
dist/
build/

# Node
node_modules/
frontend/dist/
*.log

# Docker
.dockerignore

# IDE & OS
.vscode/
.idea/
*.swp
.DS_Store
Thumbs.db

# Database
*.sqlite
*.db
postgres_data/
EOF
```

---

## Step 1.4 — Initialize Git and Push to GitHub

```bash
# Go to your project root
cd ~/path/to/cloudsage-ai

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial project setup — React + FastAPI + PostgreSQL"

# Rename branch to main
git branch -M main

# Add remote (replace YOUR_USERNAME)
git remote add origin git@github.com:YOUR_USERNAME/cloudsage-ai.git

# Push
git push -u origin main
```

---

## Step 1.5 — Create dev Branch

```bash
# Create and switch to dev branch
git checkout -b dev

# Push dev branch
git push -u origin dev

# From now on — all your work goes on dev, never directly on main
```

---

## Step 1.6 — Set Branch Protection on main

Go to GitHub → Your Repo → **Settings → Branches → Add rule**:

```
Branch name pattern: main

✅ Require a pull request before merging
✅ Require at least 1 approval
✅ Require status checks to pass before merging
✅ Do not allow bypassing the above settings
```

Click **Create**.

---

## Step 1.7 — Add GitHub Repo Topics

Go to your repo → click the ⚙️ gear next to **About** → Add topics:

```
aws  terraform  react  fastapi  devops  ai  claude  ecs  github-actions  postgresql
```

---

## ✅ Phase 1 Verification

```bash
# Should show: main and dev branches
git branch -a

# Should show your remote
git remote -v

# Push a test change
echo "# CloudSage AI" > README.md
git add README.md
git commit -m "docs: add README"
git push origin dev
```

Check GitHub — you should see both `main` and `dev` branches with your code.

---
---

# PHASE 2 — AWS Account Hardening

> **Goal:** Set up AWS securely — never use root account, enable billing alerts,
> create a dedicated IAM user for CLI access.

---

## Step 2.1 — Secure Your Root Account

Log in to AWS Console with your root email:

1. Enable **MFA on root account**: IAM → Security credentials → MFA → Assign MFA device
2. **Never use root** for anything after this step

---

## Step 2.2 — Create IAM Admin User (for CLI)

In AWS Console → **IAM → Users → Create User**:

```
Username: cloudsage-admin
Access type: ✅ Programmatic access (CLI)
Permissions: Attach policies directly → AdministratorAccess
```

After creation → **Download the .csv credentials file** — you only get this once.

---

## Step 2.3 — Configure AWS CLI

```bash
aws configure

# You'll be prompted for:
AWS Access Key ID: [paste from csv]
AWS Secret Access Key: [paste from csv]
Default region name: ap-south-1        ← Mumbai (closest to you in Jammu)
Default output format: json
```

```bash
# Verify — should show your account ID
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDA...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/cloudsage-admin"
}
```

---

## Step 2.4 — Set Up Billing Alert

```bash
# Enable billing alerts (only works in us-east-1)
aws cloudwatch put-metric-alarm \
  --alarm-name "CloudSage-BillingAlert-10USD" \
  --alarm-description "Alert when AWS bill exceeds $10" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=Currency,Value=USD \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:billing-alert \
  --region us-east-1
```

Or do it via Console: **Billing → Budgets → Create Budget → Cost Budget → $10 threshold → Email alert**.

---

## Step 2.5 — Set Your AWS Region as Environment Variable

```bash
# Add to your shell profile so it persists
echo 'export AWS_DEFAULT_REGION=ap-south-1' >> ~/.bashrc
source ~/.bashrc

# Verify
echo $AWS_DEFAULT_REGION
```

---

## ✅ Phase 2 Verification

```bash
# Identity check
aws sts get-caller-identity

# List regions to confirm CLI works
aws ec2 describe-regions --output table | head -20
```

---
---

# PHASE 3 — Terraform Remote State

> **Goal:** Create an S3 bucket + DynamoDB table so Terraform stores its state
> remotely — this is mandatory for CI/CD pipelines and team collaboration.

---

## Step 3.1 — Understand Why Remote State

By default Terraform stores state in a local `terraform.tfstate` file. Problems:
- If you delete it → you lose track of all your AWS resources
- CI/CD pipelines have no access to your local file
- Two people running Terraform simultaneously = corrupted state

**Solution:** Store state in S3 (durable) + DynamoDB (prevents simultaneous runs via locking).

---

## Step 3.2 — Create the Setup Script

```bash
mkdir -p ~/cloudsage-ai/infrastructure/scripts
cat > ~/cloudsage-ai/infrastructure/scripts/setup-tf-backend.sh << 'EOF'
#!/bin/bash
set -e

# Configuration
REGION="ap-south-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="cloudsage-tfstate-${ACCOUNT_ID}"
DYNAMODB_TABLE="cloudsage-tf-locks"

echo "Setting up Terraform backend..."
echo "Account ID: $ACCOUNT_ID"
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"

# Create S3 bucket for state
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --create-bucket-configuration LocationConstraint="$REGION"

# Enable versioning (so you can recover old states)
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled

# Enable encryption at rest
aws s3api put-bucket-encryption \
  --bucket "$BUCKET_NAME" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Block all public access
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name "$DYNAMODB_TABLE" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION"

echo ""
echo "✅ Terraform backend ready!"
echo ""
echo "Add this backend block to your Terraform:"
echo ""
echo 'terraform {'
echo '  backend "s3" {'
echo "    bucket         = \"$BUCKET_NAME\""
echo "    key            = \"cloudsage/terraform.tfstate\""
echo "    region         = \"$REGION\""
echo "    dynamodb_table = \"$DYNAMODB_TABLE\""
echo '    encrypt        = true'
echo '  }'
echo '}'
EOF

chmod +x ~/cloudsage-ai/infrastructure/scripts/setup-tf-backend.sh
```

---

## Step 3.3 — Run the Script

```bash
cd ~/cloudsage-ai
bash infrastructure/scripts/setup-tf-backend.sh
```

**Save the output** — you'll need the bucket name in the next phase.

---

## Step 3.4 — Create Terraform Root Module

```bash
mkdir -p ~/cloudsage-ai/infrastructure/terraform
```

Create `infrastructure/terraform/versions.tf`:

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "cloudsage-tfstate-YOUR_ACCOUNT_ID"   # ← replace
    key            = "cloudsage/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "cloudsage-tf-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudSage-AI"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
```

Create `infrastructure/terraform/variables.tf`:

```hcl
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "cloudsage"
}
```

Create `infrastructure/terraform/main.tf`:

```hcl
# Root module — will call sub-modules in later phases
# For now just test the backend connection

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}
```

Create `infrastructure/terraform/outputs.tf`:

```hcl
output "project_name" {
  value = local.name_prefix
}
```

---

## Step 3.5 — Initialize Terraform

```bash
cd ~/cloudsage-ai/infrastructure/terraform

terraform init
```

Expected output:
```
Initializing the backend...
Successfully configured the backend "s3"!

Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...

Terraform has been successfully initialized!
```

---

## ✅ Phase 3 Verification

```bash
# Should show backend = s3
terraform init

# Should plan with 0 changes (nothing built yet)
terraform plan

# Check state bucket exists
aws s3 ls | grep cloudsage-tfstate

# Check DynamoDB table exists
aws dynamodb describe-table \
  --table-name cloudsage-tf-locks \
  --query 'Table.TableStatus'
# Expected: "ACTIVE"
```

---
---

# PHASE 4 — Terraform VPC

> **Goal:** Build the entire AWS networking layer — VPC, public/private subnets,
> internet gateway, NAT gateway, and route tables.

---

## Step 4.1 — Understand the Network Architecture

```
                        Internet
                           │
                    Internet Gateway
                           │
              ┌────────────┴────────────┐
              │                         │
       Public Subnet AZ-a         Public Subnet AZ-b
       (ALB, NAT Gateway)         (ALB)
              │
          NAT Gateway
              │
       ┌──────┴──────┐
       │             │
  Private Subnet AZ-a   Private Subnet AZ-b
  (ECS Tasks)           (ECS Tasks, RDS)
```

**Why 2 AZs?** AWS requires ALB to span at least 2 Availability Zones. RDS Multi-AZ also needs 2.  
**Why private subnets for ECS/RDS?** Containers and database should NEVER be directly internet-accessible.  
**Why NAT Gateway?** ECS tasks in private subnets need to pull Docker images from ECR — NAT lets them reach the internet outbound without being exposed inbound.

---

## Step 4.2 — Create VPC Module

```bash
mkdir -p ~/cloudsage-ai/infrastructure/terraform/modules/vpc
```

Create `modules/vpc/main.tf`:

```hcl
# ─── VPC ────────────────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "${var.name_prefix}-vpc" }
}

# ─── INTERNET GATEWAY ───────────────────────────────────────────────────────
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.name_prefix}-igw" }
}

# ─── PUBLIC SUBNETS ─────────────────────────────────────────────────────────
resource "aws_subnet" "public" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "${var.name_prefix}-public-${var.availability_zones[count.index]}" }
}

# ─── PRIVATE SUBNETS ────────────────────────────────────────────────────────
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = { Name = "${var.name_prefix}-private-${var.availability_zones[count.index]}" }
}

# ─── ELASTIC IP FOR NAT ─────────────────────────────────────────────────────
resource "aws_eip" "nat" {
  domain = "vpc"
  tags   = { Name = "${var.name_prefix}-nat-eip" }
}

# ─── NAT GATEWAY (in first public subnet) ───────────────────────────────────
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  depends_on    = [aws_internet_gateway.main]

  tags = { Name = "${var.name_prefix}-nat" }
}

# ─── PUBLIC ROUTE TABLE ─────────────────────────────────────────────────────
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "${var.name_prefix}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ─── PRIVATE ROUTE TABLE ────────────────────────────────────────────────────
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = { Name = "${var.name_prefix}-private-rt" }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# ─── SECURITY GROUPS ────────────────────────────────────────────────────────

# ALB Security Group — allow HTTP/HTTPS from internet
resource "aws_security_group" "alb" {
  name        = "${var.name_prefix}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.name_prefix}-alb-sg" }
}

# ECS Security Group — allow traffic from ALB only
resource "aws_security_group" "ecs" {
  name        = "${var.name_prefix}-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.name_prefix}-ecs-sg" }
}

# RDS Security Group — allow traffic from ECS only
resource "aws_security_group" "rds" {
  name        = "${var.name_prefix}-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.name_prefix}-rds-sg" }
}
```

Create `modules/vpc/variables.tf`:

```hcl
variable "name_prefix"          { type = string }
variable "vpc_cidr"             { type = string  default = "10.0.0.0/16" }
variable "availability_zones"   { type = list(string) }
variable "public_subnet_cidrs"  { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
```

Create `modules/vpc/outputs.tf`:

```hcl
output "vpc_id"              { value = aws_vpc.main.id }
output "public_subnet_ids"   { value = aws_subnet.public[*].id }
output "private_subnet_ids"  { value = aws_subnet.private[*].id }
output "alb_sg_id"           { value = aws_security_group.alb.id }
output "ecs_sg_id"           { value = aws_security_group.ecs.id }
output "rds_sg_id"           { value = aws_security_group.rds.id }
```

---

## Step 4.3 — Call VPC Module from Root

Update `infrastructure/terraform/main.tf`:

```hcl
locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

module "vpc" {
  source = "./modules/vpc"

  name_prefix          = local.name_prefix
  vpc_cidr             = "10.0.0.0/16"
  availability_zones   = ["ap-south-1a", "ap-south-1b"]
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
}
```

Update `infrastructure/terraform/outputs.tf`:

```hcl
output "vpc_id"             { value = module.vpc.vpc_id }
output "public_subnet_ids"  { value = module.vpc.public_subnet_ids }
output "private_subnet_ids" { value = module.vpc.private_subnet_ids }
```

---

## Step 4.4 — Plan and Apply

```bash
cd ~/cloudsage-ai/infrastructure/terraform

# Always plan first — read every resource before applying
terraform plan

# Apply — type 'yes' when prompted
terraform apply
```

⚠️ **NAT Gateway costs ~$0.045/hour (~$32/month).** Destroy when not testing:
```bash
terraform destroy  # when done for the day
terraform apply    # when resuming
```

---

## ✅ Phase 4 Verification

```bash
# Get VPC ID from state
VPC_ID=$(terraform output -raw vpc_id)
echo "VPC ID: $VPC_ID"

# List subnets
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].{AZ:AvailabilityZone,CIDR:CidrBlock,Public:MapPublicIpOnLaunch}' \
  --output table

# List security groups
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[*].{Name:GroupName,ID:GroupId}' \
  --output table
```

You should see 4 subnets (2 public, 2 private) and 3 security groups (alb, ecs, rds).

---
---

# PHASE 5 — Terraform RDS

> **Goal:** Deploy PostgreSQL 15 in a private subnet with automated backups,
> credentials stored in AWS Secrets Manager.

---

## Step 5.1 — Store DB Password in Secrets Manager

```bash
# Generate a strong password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Save this password: $DB_PASSWORD"

# Store in Secrets Manager
aws secretsmanager create-secret \
  --name "cloudsage/dev/db-password" \
  --description "CloudSage AI RDS master password" \
  --secret-string "{\"password\":\"$DB_PASSWORD\"}" \
  --region ap-south-1
```

---

## Step 5.2 — Create RDS Module

```bash
mkdir -p ~/cloudsage-ai/infrastructure/terraform/modules/rds
```

Create `modules/rds/main.tf`:

```hcl
# Fetch DB password from Secrets Manager
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = var.db_password_secret_arn
}

locals {
  db_password = jsondecode(
    data.aws_secretsmanager_secret_version.db_password.secret_string
  )["password"]
}

# DB Subnet Group — tells RDS which subnets it can use
resource "aws_db_subnet_group" "main" {
  name       = "${var.name_prefix}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = { Name = "${var.name_prefix}-db-subnet-group" }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier     = "${var.name_prefix}-postgres"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  # Storage
  allocated_storage     = 20
  max_allocated_storage = 100          # Auto-scaling storage
  storage_type          = "gp3"
  storage_encrypted     = true

  # Database
  db_name  = var.db_name
  username = var.db_username
  password = local.db_password
  port     = 5432

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_sg_id]
  publicly_accessible    = false       # Private only!

  # Backups
  backup_retention_period = 7          # Keep 7 days of backups
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  # Protection
  deletion_protection      = false     # Set true in production
  skip_final_snapshot      = true      # Set false in production
  delete_automated_backups = true

  # Performance
  performance_insights_enabled = false  # Costs extra, skip for dev

  tags = { Name = "${var.name_prefix}-postgres" }
}
```

Create `modules/rds/variables.tf`:

```hcl
variable "name_prefix"           { type = string }
variable "private_subnet_ids"    { type = list(string) }
variable "rds_sg_id"             { type = string }
variable "db_password_secret_arn" { type = string }
variable "db_name"               { type = string  default = "cloudsage" }
variable "db_username"           { type = string  default = "cloudsage" }
variable "db_instance_class"     { type = string  default = "db.t3.micro" }
```

Create `modules/rds/outputs.tf`:

```hcl
output "db_endpoint"  { value = aws_db_instance.postgres.endpoint }
output "db_name"      { value = aws_db_instance.postgres.db_name }
output "db_port"      { value = aws_db_instance.postgres.port }
```

---

## Step 5.3 — Add RDS to Root main.tf

```hcl
# Get the secret ARN
data "aws_secretsmanager_secret" "db_password" {
  name = "cloudsage/dev/db-password"
}

module "rds" {
  source = "./modules/rds"

  name_prefix            = local.name_prefix
  private_subnet_ids     = module.vpc.private_subnet_ids
  rds_sg_id              = module.vpc.rds_sg_id
  db_password_secret_arn = data.aws_secretsmanager_secret.db_password.arn
}
```

Add to `outputs.tf`:
```hcl
output "db_endpoint" { value = module.rds.db_endpoint }
```

---

## Step 5.4 — Apply

```bash
terraform plan   # Review — should show 2 new resources (subnet group + RDS)
terraform apply  # RDS takes ~5 minutes to create
```

---

## ✅ Phase 5 Verification

```bash
# Get DB endpoint
terraform output db_endpoint

# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier cloudsage-dev-postgres \
  --query 'DBInstances[0].DBInstanceStatus'
# Expected: "available"
```

---
---

# PHASE 6 — ECR + Push Docker Images

> **Goal:** Create private container registries on AWS and push your 3 Docker
> images (frontend, backend) so ECS can pull them.

---

## Step 6.1 — Create ECR Module

```bash
mkdir -p ~/cloudsage-ai/infrastructure/terraform/modules/ecr
```

Create `modules/ecr/main.tf`:

```hcl
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.name_prefix}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true              # Auto-scan for vulnerabilities
  }

  tags = { Name = "${var.name_prefix}-frontend" }
}

resource "aws_ecr_repository" "backend" {
  name                 = "${var.name_prefix}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "${var.name_prefix}-backend" }
}

# Lifecycle policy — keep only last 10 images, delete older ones
resource "aws_ecr_lifecycle_policy" "frontend" {
  repository = aws_ecr_repository.frontend.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name
  policy     = aws_ecr_lifecycle_policy.frontend.policy
}
```

Create `modules/ecr/variables.tf`:
```hcl
variable "name_prefix" { type = string }
```

Create `modules/ecr/outputs.tf`:
```hcl
output "frontend_repo_url" { value = aws_ecr_repository.frontend.repository_url }
output "backend_repo_url"  { value = aws_ecr_repository.backend.repository_url }
output "frontend_repo_arn" { value = aws_ecr_repository.frontend.arn }
output "backend_repo_arn"  { value = aws_ecr_repository.backend.arn }
```

---

## Step 6.2 — Add ECR to Root + Apply

```hcl
# In main.tf
module "ecr" {
  source      = "./modules/ecr"
  name_prefix = local.name_prefix
}
```

```hcl
# In outputs.tf
output "frontend_repo_url" { value = module.ecr.frontend_repo_url }
output "backend_repo_url"  { value = module.ecr.backend_repo_url }
```

```bash
terraform apply
```

---

## Step 6.3 — Build and Push Docker Images

```bash
cat > ~/cloudsage-ai/infrastructure/scripts/build-and-push.sh << 'EOF'
#!/bin/bash
set -e

REGION="ap-south-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
FRONTEND_REPO="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/cloudsage-dev-frontend"
BACKEND_REPO="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/cloudsage-dev-backend"
TAG=${1:-latest}

echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin \
  "${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "🏗️ Building frontend..."
cd ~/cloudsage-ai/frontend
docker build -t $FRONTEND_REPO:$TAG .
docker push $FRONTEND_REPO:$TAG

echo "🏗️ Building backend..."
cd ~/cloudsage-ai/backend
docker build -t $BACKEND_REPO:$TAG .
docker push $BACKEND_REPO:$TAG

echo "✅ Images pushed!"
echo "Frontend: $FRONTEND_REPO:$TAG"
echo "Backend:  $BACKEND_REPO:$TAG"
EOF

chmod +x ~/cloudsage-ai/infrastructure/scripts/build-and-push.sh
bash ~/cloudsage-ai/infrastructure/scripts/build-and-push.sh latest
```

---

## ✅ Phase 6 Verification

```bash
# List images in frontend repo
aws ecr list-images \
  --repository-name cloudsage-dev-frontend \
  --region ap-south-1 \
  --query 'imageIds[*].imageTag'

# List images in backend repo
aws ecr list-images \
  --repository-name cloudsage-dev-backend \
  --region ap-south-1 \
  --query 'imageIds[*].imageTag'
```

Both should return `["latest"]`.

---
---

# PHASE 7 — Terraform ECS Fargate

> **Goal:** Deploy your containers on ECS Fargate — serverless containers,
> no EC2 instances to manage.

---

## Step 7.1 — Create ECS Module

```bash
mkdir -p ~/cloudsage-ai/infrastructure/terraform/modules/ecs
```

Create `modules/ecs/main.tf`:

```hcl
# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = { Name = "${var.name_prefix}-cluster" }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.name_prefix}/frontend"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.name_prefix}/backend"
  retention_in_days = 7
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_execution" {
  name = "${var.name_prefix}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Allow ECS to read Secrets Manager
resource "aws_iam_role_policy" "ecs_secrets" {
  name = "${var.name_prefix}-ecs-secrets-policy"
  role = aws_iam_role.ecs_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["secretsmanager:GetSecretValue"]
      Resource = var.secrets_arns
    }]
  })
}

# Frontend Task Definition
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.name_prefix}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name  = "frontend"
    image = "${var.frontend_image_url}:latest"
    portMappings = [{ containerPort = 80, protocol = "tcp" }]

    environment = [
      { name = "VITE_API_URL", value = "http://${var.alb_dns_name}" }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "frontend"
      }
    }
  }])
}

# Backend Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.name_prefix}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name  = "backend"
    image = "${var.backend_image_url}:latest"
    portMappings = [{ containerPort = 8000, protocol = "tcp" }]

    secrets = [
      {
        name      = "ANTHROPIC_API_KEY"
        valueFrom = "${var.anthropic_secret_arn}:api_key::"
      }
    ]

    environment = [
      { name = "APP_ENV",    value = var.environment },
      { name = "DATABASE_URL", value = var.database_url }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "backend"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])
}

# Frontend ECS Service
resource "aws_ecs_service" "frontend" {
  name            = "${var.name_prefix}-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_sg_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = 80
  }

  depends_on = [var.alb_listener_arn]
}

# Backend ECS Service
resource "aws_ecs_service" "backend" {
  name            = "${var.name_prefix}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_sg_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend"
    container_port   = 8000
  }

  depends_on = [var.alb_listener_arn]
}
```

> Create `modules/ecs/variables.tf` and `modules/ecs/outputs.tf` following the same pattern — declare all variables referenced above and output cluster_id, frontend/backend service names.

---

## ✅ Phase 7 Verification

```bash
# List ECS services
aws ecs list-services \
  --cluster cloudsage-dev-cluster \
  --region ap-south-1

# Check service health
aws ecs describe-services \
  --cluster cloudsage-dev-cluster \
  --services cloudsage-dev-frontend cloudsage-dev-backend \
  --query 'services[*].{Name:serviceName,Running:runningCount,Desired:desiredCount,Status:status}' \
  --output table
```

---
---

# PHASE 8 — Terraform ALB

> **Goal:** Create an Application Load Balancer that routes:
> - `/api/*` → Backend ECS service (port 8000)
> - `/*` → Frontend ECS service (port 80)

---

## Step 8.1 — Create ALB Module

```bash
mkdir -p ~/cloudsage-ai/infrastructure/terraform/modules/alb
```

Create `modules/alb/main.tf`:

```hcl
# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false   # Set true in production

  tags = { Name = "${var.name_prefix}-alb" }
}

# Target Group — Frontend
resource "aws_lb_target_group" "frontend" {
  name        = "${var.name_prefix}-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"              # Required for Fargate

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    path                = "/"
    matcher             = "200"
  }

  tags = { Name = "${var.name_prefix}-frontend-tg" }
}

# Target Group — Backend
resource "aws_lb_target_group" "backend" {
  name        = "${var.name_prefix}-backend-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  tags = { Name = "${var.name_prefix}-backend-tg" }
}

# HTTP Listener with routing rules
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  # Default: route to frontend
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Listener Rule — /api/* → backend
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  condition {
    path_pattern { values = ["/api/*", "/health"] }
  }

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}
```

Create `modules/alb/outputs.tf`:

```hcl
output "alb_dns_name"              { value = aws_lb.main.dns_name }
output "alb_arn"                   { value = aws_lb.main.arn }
output "frontend_target_group_arn" { value = aws_lb_target_group.frontend.arn }
output "backend_target_group_arn"  { value = aws_lb_target_group.backend.arn }
output "listener_arn"              { value = aws_lb_listener.http.arn }
```

---

## ✅ Phase 8 Verification

```bash
# Get ALB DNS name
ALB_DNS=$(terraform output -raw alb_dns_name)
echo "App URL: http://$ALB_DNS"

# Test frontend
curl -o /dev/null -s -w "%{http_code}" http://$ALB_DNS/
# Expected: 200

# Test backend health
curl http://$ALB_DNS/health
# Expected: {"status": "ok", "db": "ok"}
```

🎉 **Your app is live on AWS at this point.**

---
---

# PHASE 9 — GitHub Actions CI/CD

> **Goal:** Every push to `dev` → automatically builds Docker images, pushes
> to ECR, and deploys to ECS. Zero manual steps after this.

---

## Step 9.1 — Set Up OIDC (No AWS Keys in GitHub)

OIDC lets GitHub Actions assume an IAM role directly — no `AWS_ACCESS_KEY_ID` or
`AWS_SECRET_ACCESS_KEY` stored in GitHub. This is the professional, secure way.

```bash
# Create OIDC provider for GitHub Actions
aws iam create-open-id-connect-provider \
  --url "https://token.actions.githubusercontent.com" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1"
```

---

## Step 9.2 — Create IAM Role for GitHub Actions

```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"    # ← replace
REPO_NAME="cloudsage-ai"

cat > /tmp/github-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_USERNAME}/${REPO_NAME}:*"
        }
      }
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name cloudsage-github-actions-role \
  --assume-role-policy-document file:///tmp/github-trust-policy.json

# Attach required permissions
aws iam attach-role-policy \
  --role-name cloudsage-github-actions-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

aws iam attach-role-policy \
  --role-name cloudsage-github-actions-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

# Get the Role ARN — you'll need this for GitHub Secrets
aws iam get-role \
  --role-name cloudsage-github-actions-role \
  --query 'Role.Arn' \
  --output text
```

---

## Step 9.3 — Add GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**:

```
AWS_ROLE_ARN         →  arn:aws:iam::YOUR_ACCOUNT_ID:role/cloudsage-github-actions-role
AWS_REGION           →  ap-south-1
ECR_FRONTEND_REPO    →  YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/cloudsage-dev-frontend
ECR_BACKEND_REPO     →  YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/cloudsage-dev-backend
ECS_CLUSTER          →  cloudsage-dev-cluster
ECS_FRONTEND_SERVICE →  cloudsage-dev-frontend
ECS_BACKEND_SERVICE  →  cloudsage-dev-backend
```

---

## Step 9.4 — Create CI Pipeline (runs on every PR)

Create `.github/workflows/ci.yml`:

```yaml
name: CI — Lint, Test & Build

on:
  pull_request:
    branches: [main, dev]

jobs:
  backend-test:
    name: Backend Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        working-directory: backend
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run tests
        working-directory: backend
        run: pytest tests/ -v

  frontend-build:
    name: Frontend Build Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Build
        working-directory: frontend
        run: npm run build
        env:
          VITE_API_URL: http://localhost:8000

  docker-build:
    name: Docker Build Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build frontend image
        run: docker build -t cloudsage-frontend:test ./frontend

      - name: Build backend image
        run: docker build -t cloudsage-backend:test ./backend
```

---

## Step 9.5 — Create Deploy Pipeline (runs on push to dev)

Create `.github/workflows/deploy-dev.yml`:

```yaml
name: Deploy — Dev Environment

on:
  push:
    branches: [dev]

permissions:
  id-token: write    # Required for OIDC
  contents: read

env:
  AWS_REGION: ${{ secrets.AWS_REGION }}

jobs:
  deploy:
    name: Build, Push & Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # ── OIDC Authentication (no AWS keys!) ──────────────────────────────
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ secrets.AWS_REGION }}

      # ── Login to ECR ─────────────────────────────────────────────────────
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      # ── Build & Push Frontend ────────────────────────────────────────────
      - name: Build and push frontend
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build \
            --build-arg VITE_API_URL=http://${{ secrets.ALB_DNS }} \
            -t ${{ secrets.ECR_FRONTEND_REPO }}:$IMAGE_TAG \
            -t ${{ secrets.ECR_FRONTEND_REPO }}:latest \
            ./frontend

          docker push ${{ secrets.ECR_FRONTEND_REPO }}:$IMAGE_TAG
          docker push ${{ secrets.ECR_FRONTEND_REPO }}:latest

      # ── Build & Push Backend ─────────────────────────────────────────────
      - name: Build and push backend
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build \
            -t ${{ secrets.ECR_BACKEND_REPO }}:$IMAGE_TAG \
            -t ${{ secrets.ECR_BACKEND_REPO }}:latest \
            ./backend

          docker push ${{ secrets.ECR_BACKEND_REPO }}:$IMAGE_TAG
          docker push ${{ secrets.ECR_BACKEND_REPO }}:latest

      # ── Deploy to ECS ────────────────────────────────────────────────────
      - name: Deploy frontend to ECS
        run: |
          aws ecs update-service \
            --cluster ${{ secrets.ECS_CLUSTER }} \
            --service ${{ secrets.ECS_FRONTEND_SERVICE }} \
            --force-new-deployment \
            --region ${{ secrets.AWS_REGION }}

      - name: Deploy backend to ECS
        run: |
          aws ecs update-service \
            --cluster ${{ secrets.ECS_CLUSTER }} \
            --service ${{ secrets.ECS_BACKEND_SERVICE }} \
            --force-new-deployment \
            --region ${{ secrets.AWS_REGION }}

      # ── Wait for stability ───────────────────────────────────────────────
      - name: Wait for frontend service stable
        run: |
          aws ecs wait services-stable \
            --cluster ${{ secrets.ECS_CLUSTER }} \
            --services ${{ secrets.ECS_FRONTEND_SERVICE }} \
            --region ${{ secrets.AWS_REGION }}

      - name: Wait for backend service stable
        run: |
          aws ecs wait services-stable \
            --cluster ${{ secrets.ECS_CLUSTER }} \
            --services ${{ secrets.ECS_BACKEND_SERVICE }} \
            --region ${{ secrets.AWS_REGION }}

      - name: Deployment complete
        run: echo "✅ CloudSage AI deployed successfully to dev!"
```

---

## Step 9.6 — Push and Trigger First Deployment

```bash
cd ~/cloudsage-ai

# Add all new files
git add .github/ infrastructure/

git commit -m "ci: add GitHub Actions CI/CD pipeline + Terraform infrastructure"

git push origin dev
```

Go to GitHub → **Actions tab** → Watch your pipeline run live.

---

## ✅ Phase 9 Verification

```bash
# Check pipeline ran successfully in GitHub Actions UI

# Verify new ECS deployment triggered
aws ecs describe-services \
  --cluster cloudsage-dev-cluster \
  --services cloudsage-dev-frontend cloudsage-dev-backend \
  --query 'services[*].{Name:serviceName,Running:runningCount,LastDeployment:deployments[0].status}' \
  --output table

# Hit the live URL
curl -s http://$(terraform output -raw alb_dns_name)/health
```

---
---

## 🏁 You're Done — Full Production Stack on AWS

```
✅ Phase 0 — All DevOps tools installed
✅ Phase 1 — Code on GitHub with branch protection
✅ Phase 2 — AWS account secured (IAM, billing alerts)
✅ Phase 3 — Terraform remote state (S3 + DynamoDB)
✅ Phase 4 — VPC with public/private subnets across 2 AZs
✅ Phase 5 — RDS PostgreSQL in private subnet
✅ Phase 6 — ECR repos with Docker images pushed
✅ Phase 7 — ECS Fargate running frontend + backend
✅ Phase 8 — ALB routing /api/* to backend, /* to frontend
✅ Phase 9 — GitHub Actions CI/CD with OIDC (no AWS keys!)
```

---

## 💰 Cost Control — Destroy When Not Using

```bash
# Tear down everything to avoid charges
cd ~/cloudsage-ai/infrastructure/terraform
terraform destroy

# Rebuild when you resume
terraform apply
```

---

## 📄 What to Write in Your Resume

```
• Designed and deployed a production 3-tier AWS architecture (ECS Fargate +
  RDS PostgreSQL + ALB) for an AI-powered cloud cost optimization platform
  using Terraform IaC with modular design (VPC, ECS, RDS, ALB, ECR modules)

• Implemented GitHub Actions CI/CD pipeline with AWS OIDC authentication —
  eliminating hardcoded credentials — automating Docker build, ECR push,
  and zero-downtime ECS rolling deployments on every git push

• Managed Terraform remote state with S3 backend and DynamoDB state locking,
  enabling safe concurrent infrastructure operations
```

---

*Project: CloudSage AI | DevOps Stack: Terraform + GitHub Actions + ECS Fargate + RDS + ALB*
