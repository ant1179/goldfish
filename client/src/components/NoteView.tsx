import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { notesApi, type Note } from '@/services/api'
import { Calendar, Edit, Trash2, Pencil } from 'lucide-react'

export function NoteView() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (!id) {
      setError('ID de note manquant')
      setIsLoading(false)
      return
    }

    const loadNote = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const loadedNote = await notesApi.getNote(id)
        setNote(loadedNote)
      } catch (err) {
        setError('Erreur lors du chargement de la note. Veuillez réessayer.')
        console.error('Error loading note:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadNote()
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!id) return

    try {
      await notesApi.deleteNote(id)
      navigate('/notes')
    } catch (err) {
      setError('Erreur lors de la suppression de la note. Veuillez réessayer.')
      console.error('Error deleting note:', err)
      setDeleteDialogOpen(false)
    }
  }

  const handleEditClick = () => {
    if (id) {
      navigate(`/notes/${id}/edit`)
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

  if (error && !note) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">{error}</p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => navigate('/notes')}>
              Retour à la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!note) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Note introuvable</p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => navigate('/notes')}>
              Retour à la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer la note"
        description={`Êtes-vous sûr de vouloir supprimer la note "${note.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{note.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Créée le {formatDate(note.created_at)}</span>
                {note.updated_at !== note.created_at && (
                  <>
                    <span>•</span>
                    <Edit className="h-4 w-4" />
                    <span>Modifiée le {formatDate(note.updated_at)}</span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-destructive">{error}</div>
          )}
          <div 
            className="prose prose-sm max-w-none text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </CardContent>
      </Card>
    </>
  )
}

