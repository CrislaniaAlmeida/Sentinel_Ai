"""Adiciona embedding de aparencia aos eventos (busca por texto)

Revision ID: 7f3e2a9c1d45
Revises: c64271b9ba2c
Create Date: 2026-10-02

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '7f3e2a9c1d45'
down_revision: Union[str, None] = 'c64271b9ba2c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ativa o pgvector: permite guardar e comparar embeddings no PostgreSQL
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Cada evento ganha um embedding de 512 números com a aparência do alvo.
    # Fica vazio (NULL) até o Colab calcular.
    op.execute("ALTER TABLE eventos ADD COLUMN embedding vector(512)")


def downgrade() -> None:
    op.execute("ALTER TABLE eventos DROP COLUMN IF EXISTS embedding")