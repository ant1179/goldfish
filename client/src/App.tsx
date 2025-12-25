import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NoteForm } from './components/NoteForm'
import { NoteList } from './components/NoteList'
import { useState } from 'react'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNoteCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold">Goldfish</h1>
            <p className="text-muted-foreground mt-2">
              Application de prise de notes
            </p>
          </header>

          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-8">
                  <NoteForm onNoteCreated={handleNoteCreated} />
                  <NoteList refreshKey={refreshKey} />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

