import prisma from '../lib/prismaClient'
import { AppointmentStatus } from '@prisma/client'


export class AppointmentService {
  async create(data: {
    customerId: string
    businessId: string
    workerId?: string
    date: Date
    note?: string
    serviceIds: string[]
  }) {
    const appointment = await prisma.appointment.create({
      data: {
        customerId: data.customerId,
        businessId: data.businessId,
        workerId: data.workerId,
        date: data.date,
        note: data.note,
        services: {
          create: data.serviceIds.map((id) => ({
            service: { connect: { id } },
          })),
        },
      },
      include: {
        services: {
          include: { service: true },
        },
      },
    })

    return appointment
  }

  async getById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        services: { include: { service: true } },
        worker: true,
        business: true,
      },
    })
  }

  async getByCustomer(userId: string) {
    return prisma.appointment.findMany({
      where: { customerId: userId, isDeleted: false },
      include: {
        services: { include: { service: true } },
        business: true,
        worker: true,
      },
      orderBy: { date: 'desc' },
    })
  }

  async cancelById(id: string, deletedBy: string) {
    return prisma.appointment.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
      },
    })
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    return await prisma.appointment.update({
      where: { id },
      data: { status },
    })
  }
  
}
