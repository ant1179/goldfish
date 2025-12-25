"""Routes API for note management."""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from server.database import get_db
from server.models.note import Note
from server.schemas.note import NoteCreate, NoteResponse


router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db),
) -> NoteResponse:
    """Create a new note."""
    note = Note(
        title=note_data.title,
        content=note_data.content,
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return NoteResponse.model_validate(note)


@router.get("", response_model=List[NoteResponse])
async def list_notes(
    db: AsyncSession = Depends(get_db),
) -> List[NoteResponse]:
    """List all notes."""
    result = await db.execute(select(Note).order_by(Note.created_at.desc()))
    notes = result.scalars().all()
    return [NoteResponse.model_validate(note) for note in notes]

