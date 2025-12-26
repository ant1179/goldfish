import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { notesApi, type Note } from '@/services/api'
import { FileText, Calendar, Edit } from 'lucide-react'

interface NoteListProps {
  refreshKey?: number
}

export function NoteList({ refreshKey }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await notesApi.listNotes()
      setNotes(data)
    } catch (err) {
      setError('Erreur lors du chargement des notes. Veuillez réessayer.')
      console.error('Error fetching notes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [refreshKey])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chargement des notes...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Aucune note pour le moment. Créez votre première note ci-dessus !
          </p>
        </CardContent>
      </Card>
    )
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength).trim() + '...'
  }

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) {
      return title
    }
    return title.substring(0, maxLength).trim() + '...'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mes notes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight mb-1">
                    {truncateTitle(note.title)}
                  </h3>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                {truncateContent(note.content)}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(note.created_at)}</span>
                </div>
                {note.updated_at !== note.created_at && (
                  <div className="flex items-center gap-1">
                    <Edit className="h-3 w-3" />
                    <span>{formatTime(note.updated_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

