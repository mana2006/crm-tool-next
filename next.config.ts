import type { NextConfig } from "next"

// Header bảo mật gắn vào mọi response, giống middleware thêm header trong Laravel
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" }, // trình duyệt không đoán loại file
  { key: "X-Frame-Options", value: "DENY" }, // trang không bị nhúng vào iframe của site khác
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, // không lộ URL đầy đủ khi bấm link ra ngoài
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }, // tắt quyền không dùng tới
]

const nextConfig: NextConfig = {
  // --- Ba cờ do create-next-app 16.4.5 sinh ra (xem bảng ở mục trước) ---
  experimental: {
    agentFeedback: true, // chỉ phục vụ AI agent báo lỗi Next.js; xoá cũng được
  },
  cacheComponents: true, // mặc định không cache; muốn cache thì ghi "use cache"
  partialPrefetching: true, // tải trước vỏ trang khi link hiện ra; đi cặp với cacheComponents

  // Nối Tailwind 4 vào Turbopack (bộ build của Next, vai trò như Vite). Không cần động vào.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // --- Thêm ở giai đoạn 0 ---
  output: "standalone", // build ra thư mục tự chạy được, chỉ gồm thư viện thật sự cần, để đóng Docker gọn
  reactCompiler: true, // tự tối ưu render, nên không phải viết useMemo/useCallback bằng tay
  poweredByHeader: false, // bỏ header "X-Powered-By: Next.js", không tiết lộ công nghệ
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }] // áp header bảo mật cho mọi đường dẫn
  },
}

export default nextConfig
