import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/RichTextEditor'
import { notesApi, type NoteCreate, type NoteUpdate } from '@/services/api'

interface NoteFormProps {
  onNoteCreated: () => void
}

export function NoteForm({ onNoteCreated }: NoteFormProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEditMode && id) {
      const loadNote = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
          const note = await notesApi.getNote(id)
          setTitle(note.title)
          setContent(note.content)
        } catch (err) {
          setError('Erreur lors du chargement de la note. Veuillez réessayer.')
          console.error('Error loading note:', err)
        } finally {
          setIsLoading(false)
        }
      }
      
      loadNote()
    }
  }, [isEditMode, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Strip HTML tags to check if content is empty (only whitespace/HTML tags)
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    
    if (!title.trim() || !textContent) {
      setError('Le titre et le contenu sont requis')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (isEditMode && id) {
        const noteData: NoteUpdate = {
          title: title.trim(),
          content: content,
        }
        await notesApi.updateNote(id, noteData)
      } else {
        const noteData: NoteCreate = {
          title: title.trim(),
          content: content,
        }
        await notesApi.createNote(noteData)
        // Reset form only on creation
        setTitle('')
        setContent('')
      }
      
      onNoteCreated()
      // Navigate to notes list after creation/update
      navigate('/notes')
    } catch (err) {
      const errorMessage = isEditMode
        ? 'Erreur lors de la mise à jour de la note. Veuillez réessayer.'
        : 'Erreur lors de la création de la note. Veuillez réessayer.'
      setError(errorMessage)
      console.error('Error saving note:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chargement de la note...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Modifier la note' : 'Nouvelle note'}</CardTitle>
        <CardDescription>
          {isEditMode
            ? 'Modifiez votre note en utilisant le formulaire ci-dessous'
            : 'Créez une nouvelle note en remplissant le formulaire ci-dessous'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Entrez le titre de la note"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Entrez le contenu de la note"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="flex gap-2">
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/notes')}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? (isEditMode ? 'Mise à jour...' : 'Création...')
                : (isEditMode ? 'Mettre à jour la note' : 'Créer la note')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

