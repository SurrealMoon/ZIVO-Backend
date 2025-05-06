import multer from 'multer'

// Bellekte saklama (RAM)
const memoryStorage = multer.memoryStorage()

// Fotoğraf yükleme için (profil, business, review)
export const photoUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

// Video (veya büyük medya) yükleme için (portfolio gibi)
export const videoUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
})
