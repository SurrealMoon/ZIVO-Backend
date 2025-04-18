import prisma from '../lib/prismaClient'

export class BusinessTypeService {
  async getAllTypes() {
    return await prisma.businessType.findMany({
      orderBy: { name: 'asc' }
    })
  }
}
