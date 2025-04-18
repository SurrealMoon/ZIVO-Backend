// src/services/workerTypes-service.ts
import prisma from '../lib/prismaClient'

export class WorkerTypeService {
  async getAllWorkerTypes() {
    return await prisma.workerType.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async createWorkerType(name: string, description?: string) {
    return await prisma.workerType.create({
      data: { name, description },
    })
  }

  async updateWorkerType(id: string, name: string, description?: string) {
    return await prisma.workerType.update({
      where: { id },
      data: { name, description },
    })
  }

  async deleteWorkerType(id: string) {
    return await prisma.workerType.delete({
      where: { id },
    })
  }
}
