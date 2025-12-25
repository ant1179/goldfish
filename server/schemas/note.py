"""Pydantic schemas for note validation."""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    """Schema for note creation."""
    
    title: str = Field(..., min_length=1, max_length=255, description="Note title")
    content: str = Field(..., min_length=1, description="Note content")


class NoteResponse(BaseModel):
    """Schema for note response."""
    
    id: UUID
    title: str
    content: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

