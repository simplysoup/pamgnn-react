import { ProjectCardGrid } from '@/components/ui/ProjectCardGrid'
import { getProjectsByCategory } from '@/data/static-projects'

export default async function IllustrationPage() {
  const projects = getProjectsByCategory('illustration')
  return (
    <div className="bg-white text-dark pt-40 pb-20">
      <div className="w-full max-w-[1290px] mx-auto px-10 pb-[60px] relative">
        <ProjectCardGrid projects={projects} heading="Illustration" />
      </div>
    </div>
  )
}
