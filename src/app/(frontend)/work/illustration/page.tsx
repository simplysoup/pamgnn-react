import { ProjectCardGrid } from '@/components/ui/ProjectCardGrid'
import { getProjectsByCategory } from '@/data/static-projects'

export default async function IllustrationPage() {
  const projects = getProjectsByCategory('illustration')
  return (
    <div className="page-sections">
      <div className="container">
        <ProjectCardGrid projects={projects} heading="Illustration" />
      </div>
    </div>
  )
}
