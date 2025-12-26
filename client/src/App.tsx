import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { NoteForm } from './components/NoteForm'
import { NoteList } from './components/NoteList'
import { NoteView } from './components/NoteView'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logo from '@/assets/images/goldfish.png'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNoteCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={logo} 
                  alt="Goldfish Logo" 
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <h1 className="text-4xl font-bold">Goldfish</h1>
                  <p className="text-muted-foreground mt-2">
                    Application de prise de notes
                  </p>
                </div>
              </div>
              <nav className="flex gap-2">
                <Link
                  to="/notes"
                  className={cn(buttonVariants({ variant: 'outline' }))}
                >
                  Mes notes
                </Link>
                <Link
                  to="/notes/new"
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  Nouvelle note
                </Link>
              </nav>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route
              path="/notes/new"
              element={<NoteForm onNoteCreated={handleNoteCreated} />}
            />
            <Route
              path="/notes/:id/view"
              element={<NoteView />}
            />
            <Route
              path="/notes/:id/edit"
              element={<NoteForm onNoteCreated={handleNoteCreated} />}
            />
            <Route
              path="/notes"
              element={<NoteList refreshKey={refreshKey} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

