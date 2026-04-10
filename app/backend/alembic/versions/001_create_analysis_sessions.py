"""create analysis_sessions table

Revision ID: 001
Revises: 
Create Date: 2026-04-09 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgcrypto for gen_random_uuid() (PostgreSQL 13 and below need this)
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    op.create_table(
        'analysis_sessions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'), nullable=False),
        sa.Column('title', sa.String(255), nullable=True),
        sa.Column('input_config', JSONB, nullable=False),
        sa.Column('input_type', sa.String(50), nullable=True),
        sa.Column('ai_response', JSONB, nullable=False),
        sa.Column('total_monthly_cost', sa.Numeric(12, 2), nullable=True),
        sa.Column('optimized_monthly_cost', sa.Numeric(12, 2), nullable=True),
        sa.Column('total_savings', sa.Numeric(12, 2), nullable=True),
        sa.Column('savings_percentage', sa.Numeric(5, 2), nullable=True),
        sa.Column('overall_health_score', sa.Integer, nullable=True),
        sa.Column('status', sa.String(50), server_default='completed', nullable=False),
    )

    # Index on created_at for efficient sorting
    op.create_index('idx_sessions_created_at', 'analysis_sessions', ['created_at'], postgresql_ops={'created_at': 'DESC'})


def downgrade() -> None:
    op.drop_index('idx_sessions_created_at', table_name='analysis_sessions')
    op.drop_table('analysis_sessions')
