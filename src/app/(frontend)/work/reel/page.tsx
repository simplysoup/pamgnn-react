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
      <div className="bg-white text-dark pt-40 pb-20">
        <div className="w-full max-w-[1290px] mx-auto px-10 pb-[60px] relative">
          <ProjectCardGrid projects={projects} />
        </div>
      </div>
    </>
  )
}
