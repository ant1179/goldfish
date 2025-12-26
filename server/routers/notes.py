"""Routes API for note management."""

from typing import List
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from database import get_db
from models.note import Note
from schemas.note import NoteCreate, NoteUpdate, NoteResponse


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


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> NoteResponse:
    """Get a note by ID."""
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return NoteResponse.model_validate(note)


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: UUID,
    note_data: NoteUpdate,
    db: AsyncSession = Depends(get_db),
) -> NoteResponse:
    """Update a note by ID."""
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    note.title = note_data.title
    note.content = note_data.content
    note.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(note)
    
    return NoteResponse.model_validate(note)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a note by ID."""
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    await db.execute(delete(Note).where(Note.id == note_id))
    await db.commit()

