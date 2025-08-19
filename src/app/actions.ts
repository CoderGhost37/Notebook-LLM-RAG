'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'

export async function getDataSources() {
  try {
    const data = await prisma.dataSource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return data || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function deleteDataSource(id: string) {
  try {
    await prisma.dataSource.delete({
      where: { id },
    })
    revalidatePath('/')

    return {
      success: true,
      message: 'Data source deleted successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Failed to delete data source',
    }
  }
}
