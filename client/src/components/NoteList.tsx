import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { notesApi, type Note } from '@/services/api'
import { FileText, Calendar, Edit, Pencil } from 'lucide-react'

interface NoteListProps {
  refreshKey?: number
}

export function NoteList({ refreshKey }: NoteListProps) {
  const navigate = useNavigate()
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

  // Grouper les notes par date de création
  const groupNotesByDate = (notes: Note[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const groups: { [key: string]: Note[] } = {
      'Aujourd\'hui': [],
      'Cette semaine': [],
      'La semaine dernière': [],
      'Le mois dernier': [],
      'Plus ancien': [],
    }

    // Trier les notes par date de création (plus récentes en premier)
    const sortedNotes = [...notes].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    sortedNotes.forEach((note) => {
      const noteDate = new Date(note.created_at)
      const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())

      if (noteDateOnly.getTime() === today.getTime()) {
        groups['Aujourd\'hui'].push(note)
      } else if (noteDateOnly >= weekAgo) {
        groups['Cette semaine'].push(note)
      } else if (noteDateOnly >= twoWeeksAgo) {
        groups['La semaine dernière'].push(note)
      } else if (noteDateOnly >= monthAgo) {
        groups['Le mois dernier'].push(note)
      } else {
        groups['Plus ancien'].push(note)
      }
    })

    return groups
  }

  const groupedNotes = groupNotesByDate(notes)
  const groupLabels = ['Aujourd\'hui', 'Cette semaine', 'La semaine dernière', 'Le mois dernier', 'Plus ancien']

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mes notes</h2>
      <div className="space-y-4">
        {groupLabels.map((label) => {
          const groupNotes = groupedNotes[label]
          if (groupNotes.length === 0) return null

          return (
            <Collapsible
              key={label}
              title={`${label} (${groupNotes.length})`}
              defaultOpen={label === 'Aujourd\'hui' || label === 'Cette semaine'}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupNotes.map((note) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
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
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/notes/${note.id}/edit`)
                          }}
                          title="Modifier la note"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}

