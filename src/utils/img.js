// .env থেকে চেষ্টা করবে, না পেলে সরাসরি লোকাল ব্যাকএন্ড লিংক নিবে
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage'

export const getImageUrl = (student) => {
  if (!student || !student.image) {
    return 'https://i.pravatar.cc/150'
  }

  // যদি অলরেডি http দিয়ে শুরু হয়
  if (typeof student.image === 'string' && student.image.startsWith('http')) {
    return student.image
  }

  // কোনো কারণে পাথের শুরুতে public/ বা storage/ থাকলে তা মুছে ক্লিন করা
  const cleanPath = String(student.image)
    .replace(/^public\//, '')
    .replace(/^storage\//, '')

  return `${STORAGE_URL}/${cleanPath}`
}
