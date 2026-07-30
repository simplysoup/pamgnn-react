import { ProjectCardGrid } from '@/components/ui/ProjectCardGrid'
import { getProjectsByCategory } from '@/data/static-projects'

export default async function WebDesignPage() {
  const projects = getProjectsByCategory('web-design')
  return (
    <div className="page-sections">
      <div className="container">
        <ProjectCardGrid projects={projects} heading="Web Design" />
      </div>
    </div>
  )
}
