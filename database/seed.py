"""
seed.py — Seeds the CloudSage AI database with 3 realistic demo sessions.

Run from the project root after running Alembic migrations:
    cd /path/to/CloudSage-AI
    DATABASE_URL=postgresql+asyncpg://cloudsage:cloudsage@localhost:5432/cloudsage \
        python3 database/seed.py

Or inside Docker:
    docker exec -it cloudsage-backend python3 /app/../database/seed.py
"""
import asyncio
import sys
import os
from pathlib import Path

# Allow importing app modules from the backend directory
BACKEND_DIR = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select

from app.config import get_settings
from app.models.session import AnalysisSession
from app.models.recommendation import Recommendation
from app.models.message import ChatMessage

settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# Demo Session 1: Over-provisioned E-Commerce Platform
# ─────────────────────────────────────────────────────────────────────────────
DEMO_SESSION_1 = {
    "title": "E-Commerce Platform — EC2 + RDS + S3",
    "input_type": "form",
    "input_config": {
        "resources": [
            {
                "type": "ec2", "name": "web-frontend",
                "instance_type": "m5.4xlarge", "count": 6,
                "region": "us-east-1", "usage_hours": 744,
            },
            {
                "type": "rds", "name": "prod-postgres",
                "instance_type": "db.r5.2xlarge", "storage_gb": 500, "multi_az": False,
            },
            {
                "type": "s3", "name": "product-assets",
                "storage_gb": 2000, "requests_k": 5000, "transfer_gb": 500,
            },
            {
                "type": "nat", "name": "nat-gateway-1",
                "data_processed_gb": 800,
            },
        ]
    },
    "ai_response": {
        "total_monthly_cost_usd": 12480.00,
        "optimized_monthly_cost_usd": 8736.00,
        "total_savings_usd": 3744.00,
        "savings_percentage": 30.0,
        "cost_breakdown": [
            {"service": "EC2", "monthly_cost": 8300.00, "percentage": 66.5},
            {"service": "RDS", "monthly_cost": 2800.00, "percentage": 22.4},
            {"service": "S3",  "monthly_cost": 980.00,  "percentage": 7.9},
            {"service": "NAT", "monthly_cost": 400.00,  "percentage": 3.2},
        ],
        "recommendations": [
            {
                "id": "rec_001",
                "resource_type": "EC2",
                "resource_name": "web-frontend",
                "issue": "6× m5.4xlarge instances running at <20% average CPU — massively over-provisioned for actual traffic.",
                "recommendation": "Rightsize to m5.xlarge and add an Auto Scaling Group with target CPU at 60%. This handles 3× the current peak with 75% fewer compute dollars.",
                "estimated_savings_usd": 2400.00,
                "priority": "high",
                "effort": "medium",
                "category": "rightsizing",
            },
            {
                "id": "rec_002",
                "resource_type": "RDS",
                "resource_name": "prod-postgres",
                "issue": "Single-AZ RDS means a multi-minute outage during any instance replacement, maintenance window, or AZ failure.",
                "recommendation": "Enable Multi-AZ standby or migrate to Aurora PostgreSQL with built-in HA. Aurora also charges per ACU-hour, which can reduce RDS cost by 20-40% at variable load.",
                "estimated_savings_usd": 0.00,
                "priority": "high",
                "effort": "easy",
                "category": "architecture",
            },
            {
                "id": "rec_003",
                "resource_type": "EC2",
                "resource_name": "web-frontend",
                "issue": "All 6 instances are On-Demand despite stable baseline traffic that has been consistent for 8+ months.",
                "recommendation": "Purchase 1-year Convertible Reserved Instances for your baseline 2 instances. Keep 4 On-Demand for burst capacity. Immediate 35% discount on baseline compute.",
                "estimated_savings_usd": 840.00,
                "priority": "medium",
                "effort": "easy",
                "category": "reserved",
            },
            {
                "id": "rec_004",
                "resource_type": "NAT",
                "resource_name": "nat-gateway-1",
                "issue": "800 GB/month routed through NAT Gateway at $0.045/GB ($36/month in data processing fees) — mostly S3 and DynamoDB traffic.",
                "recommendation": "Deploy VPC Gateway Endpoints for S3 and Interface Endpoints for any AWS services. NAT traffic for AWS services drops to zero. Estimated savings: $240/month.",
                "estimated_savings_usd": 240.00,
                "priority": "medium",
                "effort": "medium",
                "category": "architecture",
            },
            {
                "id": "rec_005",
                "resource_type": "S3",
                "resource_name": "product-assets",
                "issue": "2TB stored in S3 Standard regardless of last-access time. Static product images are typically accessed heavily at upload then rarely after 90 days.",
                "recommendation": "Enable S3 Intelligent-Tiering. Objects not accessed for 30 days auto-move to Infrequent Access (40% cheaper). Objects not accessed for 90 days move to Glacier Instant Retrieval (68% cheaper).",
                "estimated_savings_usd": 264.00,
                "priority": "low",
                "effort": "easy",
                "category": "storage",
            },
        ],
        "health_scores": {
            "overall": 62,
            "cost_efficiency": 45,
            "reliability": 70,
            "security_posture": 78,
            "scalability": 65,
            "commentary": {
                "cost_efficiency": "Severe over-provisioning across EC2 and no reserved capacity commitment. Quick wins in rightsizing alone could save $2,400/month. Priority action.",
                "reliability": "Single-AZ database is the critical risk. A hardware failure or AZ outage would cause a complete multi-minute outage for the production database.",
                "security_posture": "Security groups appear well-scoped. Consider enabling AWS Config rules and GuardDuty for continuous compliance monitoring.",
                "scalability": "No Auto Scaling Group means the platform cannot handle traffic spikes without manual intervention. Add ASG with target tracking scaling policy.",
            },
        },
        "risk_flags": [
            {
                "severity": "high",
                "resource": "prod-postgres",
                "message": "Single-AZ RDS instance — complete database outage risk during AZ failure or maintenance",
            },
            {
                "severity": "medium",
                "resource": "web-frontend",
                "message": "Over-provisioned EC2 without auto-scaling — $2,400/month wasted, no scale-out protection",
            },
            {
                "severity": "low",
                "resource": "product-assets",
                "message": "Flat S3 Standard storage for 2TB — Intelligent-Tiering saves ~$264/month with no code changes",
            },
        ],
    },
    "total_monthly_cost": 12480.00,
    "optimized_monthly_cost": 8736.00,
    "total_savings": 3744.00,
    "savings_percentage": 30.0,
    "overall_health_score": 62,
    "demo_chat": [
        {
            "role": "user",
            "content": "What are my highest priority recommendations?",
        },
        {
            "role": "assistant",
            "content": "Your **2 high-priority items** are:\n\n1. 🔴 **EC2 Rightsizing — web-frontend** — Your 6× m5.4xlarge instances run at <20% CPU. Rightsizing to m5.xlarge + Auto Scaling saves **$2,400/month** ($28,800/year). Medium effort — takes 1-2 engineering days.\n\n2. 🔴 **RDS Multi-AZ — prod-postgres** — Your production database has no standby replica. Any AZ failure = full outage. Enabling Multi-AZ is an **Easy** toggle in the AWS Console — do this today, no code changes required.\n\nStart with the RDS fix (15-minute change, zero cost), then schedule the EC2 rightsizing sprint.",
        },
    ],
}


# ─────────────────────────────────────────────────────────────────────────────
# Demo Session 2: Startup Microservices on ECS Fargate
# ─────────────────────────────────────────────────────────────────────────────
DEMO_SESSION_2 = {
    "title": "Startup Microservices — ECS Fargate + RDS",
    "input_type": "form",
    "input_config": {
        "resources": [
            {
                "type": "ecs", "name": "api-service",
                "task_count": 4, "cpu": "1024", "memory": "2048",
                "compute_type": "fargate",
            },
            {
                "type": "rds", "name": "app-postgres",
                "instance_type": "db.t3.medium", "storage_gb": 100, "multi_az": False,
            },
            {
                "type": "alb", "name": "app-alb",
                "alb_type": "application", "lcus": 50,
            },
        ]
    },
    "ai_response": {
        "total_monthly_cost_usd": 3240.00,
        "optimized_monthly_cost_usd": 2268.00,
        "total_savings_usd": 972.00,
        "savings_percentage": 30.0,
        "cost_breakdown": [
            {"service": "ECS", "monthly_cost": 1840.00, "percentage": 56.8},
            {"service": "RDS", "monthly_cost": 1120.00, "percentage": 34.6},
            {"service": "ALB", "monthly_cost": 280.00,  "percentage": 8.6},
        ],
        "recommendations": [
            {
                "id": "rec_001",
                "resource_type": "ECS",
                "resource_name": "api-service",
                "issue": "4 Fargate tasks run 24/7 but CloudWatch metrics show traffic drops 80% between midnight and 8 AM. You're paying for idle capacity 8 hours every day.",
                "recommendation": "Add Application Auto Scaling with a scheduled action: scale to 1 task at 00:00, scale back to 4 at 08:00. Alternatively, configure target tracking on RequestCountPerTarget. Saves ~$552/month.",
                "estimated_savings_usd": 552.00,
                "priority": "high",
                "effort": "easy",
                "category": "scheduling",
            },
            {
                "id": "rec_002",
                "resource_type": "ECS",
                "resource_name": "api-service",
                "issue": "Running on x86 (AMD64) Fargate platform. Container workloads without native instruction dependencies can typically run on ARM with no changes.",
                "recommendation": "Switch Fargate task definition to `runtimePlatform: { cpuArchitecture: ARM64 }`. Graviton2 ARM Fargate is ~20% cheaper than x86 for identical vCPU/memory configuration.",
                "estimated_savings_usd": 368.00,
                "priority": "medium",
                "effort": "medium",
                "category": "rightsizing",
            },
            {
                "id": "rec_003",
                "resource_type": "RDS",
                "resource_name": "app-postgres",
                "issue": "db.t3.medium is a burstable instance class. Under sustained load it consumes CPU credits and throttles to 20% baseline — acceptable for dev/test but risky for production APIs.",
                "recommendation": "Evaluate moving to db.t3.large for double the memory and burst credits, or evaluate Aurora Serverless v2 which scales automatically from 0.5 to 128 ACUs.",
                "estimated_savings_usd": 52.00,
                "priority": "low",
                "effort": "easy",
                "category": "rightsizing",
            },
        ],
        "health_scores": {
            "overall": 71,
            "cost_efficiency": 60,
            "reliability": 75,
            "security_posture": 82,
            "scalability": 68,
            "commentary": {
                "cost_efficiency": "Fargate tasks running 24/7 despite 80% traffic drop at night is the primary waste. Scheduled scaling is an easy fix with immediate savings.",
                "reliability": "t3.medium burstable RDS may throttle under sustained load. Monitor CPU Credit Balance in CloudWatch and set alarms.",
                "security_posture": "Good security posture with ALB in front of ECS. Consider adding WAF to the ALB and enabling enhanced monitoring on RDS.",
                "scalability": "ECS Fargate scales well horizontally. The main gap is the lack of automated nighttime scale-down and scale-up automation.",
            },
        },
        "risk_flags": [
            {
                "severity": "medium",
                "resource": "api-service",
                "message": "No nighttime scale-in — paying for 4 idle Fargate tasks from midnight to 8 AM daily",
            },
            {
                "severity": "low",
                "resource": "app-postgres",
                "message": "Burstable t3.medium may CPU-throttle to 20% baseline under sustained API load",
            },
        ],
    },
    "total_monthly_cost": 3240.00,
    "optimized_monthly_cost": 2268.00,
    "total_savings": 972.00,
    "savings_percentage": 30.0,
    "overall_health_score": 71,
    "demo_chat": [],
}


# ─────────────────────────────────────────────────────────────────────────────
# Demo Session 3: Data Engineering Pipeline on EC2 + S3 + ECS
# ─────────────────────────────────────────────────────────────────────────────
DEMO_SESSION_3 = {
    "title": "Data Pipeline — Spark Cluster + S3 Data Lake",
    "input_type": "json",
    "input_config": {
        "resources": [
            {
                "type": "ec2", "name": "spark-master",
                "instance_type": "r5.4xlarge", "count": 1,
                "region": "us-west-2", "usage_hours": 744,
            },
            {
                "type": "ec2", "name": "spark-workers",
                "instance_type": "r5.2xlarge", "count": 8,
                "region": "us-west-2", "usage_hours": 744,
            },
            {
                "type": "s3", "name": "data-lake",
                "storage_gb": 15000, "requests_k": 2000, "transfer_gb": 1200,
            },
            {
                "type": "ecs", "name": "etl-scheduler",
                "task_count": 2, "cpu": "512", "memory": "1024",
                "compute_type": "fargate",
            },
        ]
    },
    "ai_response": {
        "total_monthly_cost_usd": 18750.00,
        "optimized_monthly_cost_usd": 9750.00,
        "total_savings_usd": 9000.00,
        "savings_percentage": 48.0,
        "cost_breakdown": [
            {"service": "EC2", "monthly_cost": 14200.00, "percentage": 75.7},
            {"service": "S3",  "monthly_cost": 4000.00,  "percentage": 21.3},
            {"service": "ECS", "monthly_cost": 550.00,   "percentage": 2.9},
        ],
        "recommendations": [
            {
                "id": "rec_001",
                "resource_type": "EC2",
                "resource_name": "spark-workers",
                "issue": "8× r5.2xlarge Spot-eligible batch workers running On-Demand 24/7. Spark is fault-tolerant and can use Spot Instances with automatic task retry on interruption.",
                "recommendation": "Replace On-Demand Spark workers with Spot Instance fleet using EC2 Fleet or EMR managed scaling. Use diverse instance types (r5.2xlarge, r4.2xlarge, r5a.2xlarge) to reduce interruption risk. Spot pricing averages 70-80% off On-Demand.",
                "estimated_savings_usd": 6400.00,
                "priority": "high",
                "effort": "medium",
                "category": "rightsizing",
            },
            {
                "id": "rec_002",
                "resource_type": "EC2",
                "resource_name": "spark-master",
                "issue": "Spark master sits idle for ~18 hours/day — batch jobs only run during business hours and overnight ETL windows. Running 744 hours/month On-Demand.",
                "recommendation": "Schedule the Spark master to stop during idle windows using AWS Instance Scheduler or a Lambda + EventBridge cron. Running only 12 hours/day saves 50% of master cost.",
                "estimated_savings_usd": 1280.00,
                "priority": "high",
                "effort": "easy",
                "category": "scheduling",
            },
            {
                "id": "rec_003",
                "resource_type": "S3",
                "resource_name": "data-lake",
                "issue": "15TB data lake with mixed access patterns — raw ingestion files are never re-read after processing, but intermediate datasets are accessed frequently within 24 hours.",
                "recommendation": "Implement a tiering policy: raw files → S3 Glacier Instant Retrieval after 7 days (~75% cheaper), processed datasets → S3 Intelligent-Tiering, archive → Deep Archive after 90 days.",
                "estimated_savings_usd": 1100.00,
                "priority": "medium",
                "effort": "medium",
                "category": "storage",
            },
            {
                "id": "rec_004",
                "resource_type": "EC2",
                "resource_name": "spark-master",
                "issue": "Consider migrating to Amazon EMR which provides managed Spark with auto-scaling, Spot integration, and per-second billing.",
                "recommendation": "Migrate to EMR on EC2 or EMR Serverless. EMR Serverless bills only for actual vCPU-hours and GB-hours used — no idle master cost, no cluster management overhead.",
                "estimated_savings_usd": 220.00,
                "priority": "low",
                "effort": "hard",
                "category": "architecture",
            },
        ],
        "health_scores": {
            "overall": 48,
            "cost_efficiency": 25,
            "reliability": 60,
            "security_posture": 70,
            "scalability": 55,
            "commentary": {
                "cost_efficiency": "Critical: On-Demand Spark workers for a fault-tolerant batch workload is one of the most common and expensive AWS mistakes. Spot conversion is the single biggest lever available — saves $6,400/month with minimal risk.",
                "reliability": "Spark itself handles worker interruptions gracefully. The master being On-Demand is good. No single point of failure in the compute layer.",
                "security_posture": "S3 data lake should have bucket policies restricting access to specific IAM roles. Verify no public access and enable S3 server-side encryption for compliance.",
                "scalability": "EMR auto-scaling handles burst batch workloads well, but current self-managed Spark requires manual cluster resizing for large jobs.",
            },
        },
        "risk_flags": [
            {
                "severity": "high",
                "resource": "spark-workers",
                "message": "On-Demand pricing for Spot-eligible fault-tolerant workload — $6,400/month unnecessary spend",
            },
            {
                "severity": "medium",
                "resource": "data-lake",
                "message": "15TB in S3 Standard — no lifecycle rules — $1,100/month in avoidable storage cost",
            },
            {
                "severity": "low",
                "resource": "spark-master",
                "message": "Master running 24/7 despite 12+ idle hours daily — scheduling saves ~$1,280/month",
            },
        ],
    },
    "total_monthly_cost": 18750.00,
    "optimized_monthly_cost": 9750.00,
    "total_savings": 9000.00,
    "savings_percentage": 48.0,
    "overall_health_score": 48,
    "demo_chat": [
        {
            "role": "user",
            "content": "Should I use Spot Instances or migrate to EMR Serverless?",
        },
        {
            "role": "assistant",
            "content": "Great question — here's how to decide:\n\n**Use Spot Instances (EC2 Fleet) if:**\n- Your team has Spark expertise and wants to stay on self-managed clusters\n- You need custom Spark configurations not supported by EMR\n- You want savings **now** without a migration project\n- Estimated savings: **$6,400/month** (70-80% off On-Demand)\n\n**Use EMR Serverless if:**\n- You run irregular batch jobs (not 24/7) — you pay only per vCPU-second used\n- You want to eliminate cluster management entirely\n- Your jobs are short-duration (minutes to hours, not days)\n- EMR Serverless can save **90%+** vs always-on clusters for sporadic workloads\n\n**My recommendation for your setup:**\nStart with **Spot Instances this week** — it's low-risk for Spark (fault-tolerant by design) and saves $6,400/month immediately. Then evaluate EMR Serverless for the next quarter once you've right-sized the team's operational model.\n\nThe two moves combined could bring your $18,750/month down to under **$4,000/month**.",
        },
    ],
}


# ─────────────────────────────────────────────────────────────────────────────
# Seeder
# ─────────────────────────────────────────────────────────────────────────────
async def seed(database_url: str | None = None) -> None:
    url = database_url or settings.database_url
    engine = create_async_engine(url, echo=False)
    SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with SessionLocal() as db:
        # Check if already seeded
        existing = (await db.execute(select(AnalysisSession).limit(1))).scalar_one_or_none()
        if existing:
            print("ℹ️  Database already has data — skipping seed to avoid duplicates.")
            print("   To re-seed, clear the database first: DELETE FROM analysis_sessions;")
            await engine.dispose()
            return

        demos = [DEMO_SESSION_1, DEMO_SESSION_2, DEMO_SESSION_3]

        for demo in demos:
            # Create session
            session = AnalysisSession(
                title=demo["title"],
                input_config=demo["input_config"],
                input_type=demo["input_type"],
                ai_response=demo["ai_response"],
                total_monthly_cost=demo["total_monthly_cost"],
                optimized_monthly_cost=demo["optimized_monthly_cost"],
                total_savings=demo["total_savings"],
                savings_percentage=demo["savings_percentage"],
                overall_health_score=demo["overall_health_score"],
                status="completed",
            )
            db.add(session)
            await db.flush()  # Get session.id

            # Seed recommendations (denormalized)
            for rec in demo["ai_response"]["recommendations"]:
                db.add(Recommendation(
                    session_id=session.id,
                    rec_id=rec["id"],
                    resource_type=rec["resource_type"],
                    resource_name=rec["resource_name"],
                    issue=rec["issue"],
                    recommendation=rec["recommendation"],
                    estimated_savings_usd=rec["estimated_savings_usd"],
                    priority=rec["priority"],
                    effort=rec["effort"],
                    category=rec["category"],
                ))

            # Seed demo chat messages
            for msg in demo.get("demo_chat", []):
                db.add(ChatMessage(
                    session_id=session.id,
                    role=msg["role"],
                    content=msg["content"],
                ))

        await db.commit()

        total_savings = sum(d["total_savings"] for d in demos)
        print(f"\n✅ Seeded {len(demos)} demo analysis sessions")
        print(f"   Total savings identified: ${total_savings:,.0f}/month")
        print(f"   Sessions:\n" + "\n".join(f"   • {d['title']}" for d in demos))

    await engine.dispose()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Seed CloudSage AI demo data")
    parser.add_argument("--db-url", help="Override DATABASE_URL", default=None)
    args = parser.parse_args()

    asyncio.run(seed(database_url=args.db_url))
