"""create recommendations table

Revision ID: 003
Revises: 002
Create Date: 2026-04-09 00:02:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'recommendations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('session_id', UUID(as_uuid=True), sa.ForeignKey('analysis_sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rec_id', sa.String(50), nullable=True),
        sa.Column('resource_type', sa.String(100), nullable=True),
        sa.Column('resource_name', sa.String(255), nullable=True),
        sa.Column('issue', sa.Text, nullable=True),
        sa.Column('recommendation', sa.Text, nullable=True),
        sa.Column('estimated_savings_usd', sa.Numeric(10, 2), nullable=True),
        sa.Column('priority', sa.String(20), nullable=True),
        sa.Column('effort', sa.String(20), nullable=True),
        sa.Column('category', sa.String(50), nullable=True),
    )

    op.create_index('idx_recommendations_session_id', 'recommendations', ['session_id'])
    op.create_index('idx_recommendations_priority', 'recommendations', ['priority'])


def downgrade() -> None:
    op.drop_index('idx_recommendations_priority', table_name='recommendations')
    op.drop_index('idx_recommendations_session_id', table_name='recommendations')
    op.drop_table('recommendations')
