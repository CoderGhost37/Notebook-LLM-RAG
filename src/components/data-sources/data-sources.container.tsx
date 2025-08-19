import { getDataSources } from '@/app/actions'
import { DataSources } from './data-sources'
import { MobileDataSourcesContainer } from './mobile-data-sources'

export async function DataSourcesContainer() {
  const data = await getDataSources()

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <MobileDataSourcesContainer data={data} />
      </div>

      <div className="hidden lg:block w-96 border-r border-border bg-card">
        <DataSources data={data} />
      </div>
    </>
  )
}
