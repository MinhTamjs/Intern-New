// Utility functions để xử lý định dạng ngày tháng

/**
 * Định dạng ngày tháng theo locale Việt Nam
 * @param date - Ngày tháng cần định dạng
 * @returns Chuỗi ngày tháng đã định dạng
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Định dạng ngày tháng ngắn gọn (chỉ ngày/tháng/năm)
 * @param date - Ngày tháng cần định dạng
 * @returns Chuỗi ngày tháng ngắn gọn
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Kiểm tra xem hai ngày có phải cùng ngày không
 * @param date1 - Ngày thứ nhất
 * @param date2 - Ngày thứ hai
 * @returns true nếu cùng ngày
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Lấy thời gian tương đối (ví dụ: "2 giờ trước", "1 ngày trước")
 * @param date - Ngày tháng cần tính
 * @returns Chuỗi thời gian tương đối
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    return formatShortDate(date);
  }
} 