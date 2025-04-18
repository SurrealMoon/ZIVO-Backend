// src/services/businessWorkers-service.ts
import prisma from '../lib/prismaClient'

interface CreateBusinessWorkerInput {
  businessId: string
  workerTypeId: string
  userId?: string
  name: string
  photoUrl?: string
  bio?: string
}

interface UpdateBusinessWorkerInput {
  workerTypeId?: string
  name?: string
  photoUrl?: string
  bio?: string
  isActive?: boolean
}

export class BusinessWorkerService {
  async create(data: CreateBusinessWorkerInput) {
    return await prisma.businessWorker.create({
      data,
    })
  }

  async getByBusinessId(businessId: string) {
    return await prisma.businessWorker.findMany({
      where: { businessId },
      include: {
        workerType: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getById(id: string) {
    return await prisma.businessWorker.findUnique({
      where: { id },
      include: {
        workerType: true,
        user: true,
      },
    })
  }

  async update(id: string, data: UpdateBusinessWorkerInput) {
    return await prisma.businessWorker.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return await prisma.businessWorker.delete({
      where: { id },
    })
  }
}
