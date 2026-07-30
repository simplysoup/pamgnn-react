import { ProjectCardGrid } from '@/components/ui/ProjectCardGrid'
import { getProjectsByCategory } from '@/data/static-projects'

export default async function BrandingPage() {
  const projects = getProjectsByCategory('identity')
  return (
    <div className="bg-white text-dark pt-40 pb-20">
      <div className="w-full max-w-[1290px] mx-auto px-10 pb-[60px] relative">
        <ProjectCardGrid projects={projects} heading="Identity &amp; Branding" />
      </div>
    </div>
  )
}
