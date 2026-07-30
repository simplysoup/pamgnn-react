import { ReelVideoPlayer } from '@/components/project/ReelVideoPlayer'
import { ProjectCardGrid } from '@/components/ui/ProjectCardGrid'
import { getProjectsByCategory } from '@/data/static-projects'

export default async function ReelPage() {
  const projects = getProjectsByCategory('motion')
  return (
    <>
      <ReelVideoPlayer
        vimeoId="638941634"
        title="Reel"
        description="Demo reel and motion work portfolio. View selected projects on Vimeo and YouTube."
      />
      <div className="page-sections">
        <div className="container">
          <ProjectCardGrid projects={projects} />
        </div>
      </div>
    </>
  )
}
