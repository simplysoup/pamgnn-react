import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'resumeAvailable',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'youtube',
      type: 'text',
    },
    {
      name: 'linkedin',
      type: 'text',
    },
    {
      name: 'vimeo',
      type: 'text',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'copyright',
      type: 'text',
    },
    {
      name: 'heroLine1',
      type: 'text',
    },
    {
      name: 'heroLine2',
      type: 'text',
    },
    {
      name: 'heroLine3',
      type: 'text',
    },
  ],
}
