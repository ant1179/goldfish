import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { notesApi, type NoteCreate } from '@/services/api'

interface NoteFormProps {
  onNoteCreated: () => void
}

export function NoteForm({ onNoteCreated }: NoteFormProps) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Le titre et le contenu sont requis')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const noteData: NoteCreate = {
        title: title.trim(),
        content: content.trim(),
      }
      
      await notesApi.createNote(noteData)
      
      // Reset form
      setTitle('')
      setContent('')
      onNoteCreated()
      // Navigate to notes list after creation
      navigate('/notes')
    } catch (err) {
      setError('Erreur lors de la création de la note. Veuillez réessayer.')
      console.error('Error creating note:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle note</CardTitle>
        <CardDescription>
          Créez une nouvelle note en remplissant le formulaire ci-dessous
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
            <Textarea
              id="content"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder="Entrez le contenu de la note"
              rows={6}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer la note'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

