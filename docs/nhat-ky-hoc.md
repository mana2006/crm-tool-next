# Nhật ký học

Mỗi buổi thêm một mục lên đầu danh sách "Các buổi", tối đa năm dòng. Ngắn nhưng đều đặn có giá trị hơn dài mà bỏ dở. Cách dùng nằm ở [hoc-qua-du-an.md](hoc-qua-du-an.md), mục 4.

## Mẫu

```md
### YYYY-MM-DD, giai đoạn X: việc đã làm

- Đoán trước:
- Thực tế:
- Bài học:
- Chưa chắc:
- Buổi sau bắt đầu từ:
```

## Câu chưa trả lời được

Câu "Tự trả lời" nào chưa trả lời được thì ghi vào đây. Mỗi tuần thử lại, trả lời được thì xoá.

## Số đo theo feature

| Feature   | Số buổi | Số lần phải tra cứu | Số lần hỏi AI | Ghi chú |
| --------- | ------- | ------------------- | ------------- | ------- |
| Contacts  |         |                     |               |         |
| Companies |         |                     |               |         |
| Tasks     |         |                     |               |         |
| Deals     |         |                     |               |         |

## Các buổi

### 2026-11-06, giai đoạn 0: đối chiếu lộ trình với repo và backend

- Đoán trước: `pnpm check` xanh nghĩa là Giai đoạn 0 đã xong, và code auth trong lộ trình dùng được ngay.
- Thực tế: mọi cổng trên máy đều xanh, nhưng `main` chưa lên GitHub nên CI nhiều khả năng chưa chạy lần nào. Backend thật dùng cookie do Nest đặt, không phải token trong JSON và Bearer như lộ trình giả định.
- Bài học: một tài liệu viết thuyết phục vẫn có thể sai ở giả định. Đọc hợp đồng thật trước khi code, và một cổng chưa từng đỏ thì chưa chứng minh được gì.
- Chưa chắc: phương án auth nào cho ADR-0001. Chưa chạy thử đăng nhập với Postgres và Redis thật.
- Buổi sau bắt đầu từ: mục 2 của `hoc-qua-du-an.md`.
