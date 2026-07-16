import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'hoverVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'mp4 file that can be served as an HTML5 video on hover',
      },
    },
    {
      name: 'order',
      type: 'number',
    },
  ],
}
