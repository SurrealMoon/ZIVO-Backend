import prisma from '../lib/prismaClient'

//businessCalendar+businessShift şemalarından oluşturuldu
export class BusinessCalendarService { 
  // 🔹 Yeni gün + shift(ler) oluştur
  async createWithShifts(businessId: string, dayOfWeek: number, isOpen: boolean, note?: string, shifts?: { startTime: string; endTime: string }[]) {
    return await prisma.businessCalendar.create({
      data: {
        businessId,
        dayOfWeek,
        isOpen,
        note,
        shifts: {
          create: shifts?.map(shift => ({
            startTime: shift.startTime,
            endTime: shift.endTime,
          })) || [],
        },
      },
      include: {
        shifts: true,
      },
    })
  }

  // 🔹 Mağazanın haftalık takvimini getir (tüm günler + shift'ler)
  async getByBusiness(businessId: string) {
    return await prisma.businessCalendar.findMany({
      where: { businessId },
      include: { shifts: true },
      orderBy: { dayOfWeek: 'asc' },
    })
  }

  // 🔹 Belirli günü getir
  async getById(id: string) {
    return await prisma.businessCalendar.findUnique({
      where: { id },
      include: { shifts: true },
    })
  }

  // 🔹 Günü güncelle (shift'ler hariç)
  async update(id: string, isOpen: boolean, note?: string) {
    return await prisma.businessCalendar.update({
      where: { id },
      data: {
        isOpen,
        note,
      },
    })
  }

  // hem calendar hem de shiftleri aynı anda güncelleyebilmek için
  async updateWithShifts(id: string, isOpen: boolean, note?: string, shifts?: { startTime: string; endTime: string }[]) {
    // 1. Calendar güncelle
    const updatedCalendar = await prisma.businessCalendar.update({
      where: { id },
      data: {
        isOpen,
        note,
      },
    })
  
    // 2. Mevcut shift'leri sil
    await prisma.businessShift.deleteMany({
      where: { calendarId: id },
    })
  
    // 3. Yeni shift'leri ekle
    const createdShifts = await prisma.businessShift.createMany({
      data: shifts?.map(shift => ({
        calendarId: id,
        startTime: shift.startTime,
        endTime: shift.endTime,
      })) || [],
    })
  
    return {
      calendar: updatedCalendar,
      shifts: createdShifts,
    }
  }
  

  // 🔹 Takvimi sil (shift'ler otomatik silinir)
  async delete(id: string) {
    return await prisma.businessCalendar.delete({
      where: { id },
    })
  }

  // 🔹 Shift oluştur (tek tek)
  async createShift(calendarId: string, startTime: string, endTime: string) {
    return await prisma.businessShift.create({
      data: {
        calendarId,
        startTime,
        endTime,
      },
    })
  }

  // 🔹 Shift sil
  async deleteShift(id: string) {
    return await prisma.businessShift.delete({
      where: { id },
    })
  }
}
