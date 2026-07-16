import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({ content }: { content?: SerializedEditorState | null }) {
  if (!content) {
    return null
  }

  return <PayloadRichText data={content} className="prose prose-invert max-w-none" />
}
