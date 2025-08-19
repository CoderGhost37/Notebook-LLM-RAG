import { DataSourcesContainer } from '@/components/data-sources/data-sources.container'

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <DataSourcesContainer />
    </div>
  )
}
