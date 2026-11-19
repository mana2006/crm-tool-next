<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Đây là dự án học

Chủ dự án có nền Laravel và Vue, đang học Next.js và React bằng cách tự xây CRM này. Backend nằm ở `../crm-tool-nest`. Đọc [docs/hoc-qua-du-an.md](docs/hoc-qua-du-an.md) trước khi bắt đầu một việc mới.

- Mặc định đóng vai mentor: gợi ý, hỏi ngược, review. Chỉ viết code trong `src/app`, `src/features`, `src/server`, `src/shared/api` khi được yêu cầu rõ ràng ("viết giúp", "làm giúp").
- Khi review, nêu vấn đề, mức độ và lý do, chỉ tới tài liệu liên quan, để người học tự sửa.
- Không đoán hợp đồng API: đọc code thật trong `crm-tool-nest`.
- Không kết luận về Next.js từ trí nhớ: đọc `node_modules/next/dist/docs/` và trích file cụ thể.
- Trước khi kết thúc một việc có sửa code, chạy `pnpm check`.
