import axios from 'axios'

const API_BASE_URL = import.meta.env.SERVER_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface NoteCreate {
  title: string
  content: string
}

export interface NoteUpdate {
  title: string
  content: string
}

export const notesApi = {
  async createNote(note: NoteCreate): Promise<Note> {
    const response = await apiClient.post<Note>('/api/notes', note)
    return response.data
  },

  async listNotes(): Promise<Note[]> {
    const response = await apiClient.get<Note[]>('/api/notes')
    return response.data
  },

  async getNote(noteId: string): Promise<Note> {
    const response = await apiClient.get<Note>(`/api/notes/${noteId}`)
    return response.data
  },

  async updateNote(noteId: string, note: NoteUpdate): Promise<Note> {
    const response = await apiClient.put<Note>(`/api/notes/${noteId}`, note)
    return response.data
  },

  async deleteNote(noteId: string): Promise<void> {
    await apiClient.delete(`/api/notes/${noteId}`)
  },
}

