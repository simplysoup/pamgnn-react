import { ProjectCardGrid } from '@/components/ui/ProjectCardGrid'
import { getProjectsByCategory } from '@/data/static-projects'

export default async function BrandingPage() {
  const projects = getProjectsByCategory('identity')
  return (
    <div className="page-sections">
      <div className="container">
        <ProjectCardGrid projects={projects} heading="Identity &amp; Branding" />
      </div>
    </div>
  )
}
