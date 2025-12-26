import { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
} from 'lucide-react'
import './RichTextEditor.css'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Entrez votre texte...',
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL du lien', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  // Sync editor content when content prop changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('rounded-md border border-input bg-background', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-input p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('bold') && 'bg-accent text-accent-foreground'
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('italic') && 'bg-accent text-accent-foreground'
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('heading', { level: 1 }) && 'bg-accent text-accent-foreground'
          )}
        >
          <span className="text-sm font-bold">H1</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('heading', { level: 2 }) && 'bg-accent text-accent-foreground'
          )}
        >
          <span className="text-sm font-bold">H2</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('heading', { level: 3 }) && 'bg-accent text-accent-foreground'
          )}
        >
          <span className="text-sm font-bold">H3</span>
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('bulletList') && 'bg-accent text-accent-foreground'
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('orderedList') && 'bg-accent text-accent-foreground'
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('blockquote') && 'bg-accent text-accent-foreground'
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={setLink}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            editor.isActive('link') && 'bg-accent text-accent-foreground'
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run() || disabled}
          className="h-8 w-8"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run() || disabled}
          className="h-8 w-8"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  )
}

