# Học Next.js và Frontend qua dự án CRM

Mục 1 và 2 cập nhật ngày 17/11/2026; mục 3 giữ số liệu đo ngày 06/11/2026. Cả hai lần đều đo trên `crm-tool-next` và `crm-tool-nest` (Next.js 16.4.5, React 19.3).

Lộ trình cho biết cần xây gì. File này lo phần còn lại: xây xong thì bạn phải giỏi lên thật. Nếu CRM hoàn thành mà rời mẫu ra bạn không tự viết lại được, bạn mới có một repo, chưa có kinh nghiệm.

| Tài liệu                                                                                      | Mở khi                                                    |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [Đánh giá 3 dự án Frontend](https://claude.ai/artifact/CbBdfq1Ppno1JtFn64WDYm)                | Muốn biết vì sao một quyết định được chọn                 |
| [Lộ trình xây dựng CRM Tool](https://claude.ai/artifact/XJPoi7R11UM51EDbeAp1DE)               | Cần mẫu code, việc bên backend và cổng của từng giai đoạn |
| [Hiểu cấu hình Next.js qua Laravel và Vue](https://claude.ai/artifact/E99t42Wsn5Ap2Syr1cDHBN) | Gặp file cấu hình hoặc thông báo lỗi lạ                   |
| [Nhật ký học](nhat-ky-hoc.md)                                                                 | Cuối mỗi buổi                                             |

Đường dẫn dạng `02-guides/...` trong file này tính từ `node_modules/next/dist/docs/01-app/`. Đó là tài liệu đúng phiên bản đang cài, nên ưu tiên hơn mọi bài viết trên mạng.

## 1. Bạn đang ở đâu

Cập nhật ngày 17/11/2026. Số liệu lấy từ code đang có ở máy, gồm cả phần chưa commit ở hai repo.

Giai đoạn 0 vẫn **chưa đóng**, trong khi code của bước 3, 4, 5 Giai đoạn 1 đã được gõ mà chưa chạy thử. Việc cần làm lúc này là dừng viết code mới, làm cho phần đã gõ chạy đúng, rồi commit từng bước nhỏ.

| Repo            | Kiểm tra                              | Kết quả                                                                                                   |
| --------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `crm-tool-next` | `pnpm typecheck`                      | Đỏ, vì 3 file route rỗng                                                                                  |
| `crm-tool-next` | `pnpm lint`, `pnpm test`              | Xanh, 17/17 test                                                                                          |
| `crm-tool-next` | Chạy thật                             | `/login` chuyển hướng vô hạn; `http.ts` ném lỗi ở mọi response thành công; BFF chưa chặn POST khác origin |
| `crm-tool-next` | Git                                   | Chưa có commit nào từ 06/11; `main` chưa lên GitHub nên CI chưa chạy lần nào                              |
| `crm-tool-nest` | lint, typecheck, test, `audit --prod` | Xanh; lint còn 8 cảnh báo file rỗng                                                                       |
| `crm-tool-nest` | Bước 7 của Giai đoạn 1                | 11 trên 12 dòng trong bảng lộ trình đã đúng khi đo; chưa có test nào giữ chúng                            |
| `crm-tool-nest` | Git                                   | Phần sửa auth chưa commit, nằm chung nhánh `chore/update_package` với việc nâng dependency                |

Điều đáng nhớ nhất của đợt này: hai file có test (`safe-redirect.ts`, `client-ip.ts`) chạy đúng, còn ba file chưa có test (`proxy.ts`, `http.ts`, `route.ts`) đều có lỗi.

## 2. Việc của tuần này

Làm theo thứ tự. Mỗi ô là một commit; xong một ô thì nhờ review rồi mới sang ô sau. Ô nào ghi "test trước" thì viết test, nhìn nó đỏ, rồi mới sửa code.

**Chặng A: dọn bàn làm việc và đóng Giai đoạn 0**

- [ ] A1. `crm-tool-next`: xoá 13 file rỗng trong `src/`; tới bước nào thì tạo file của bước đó. Xong khi `pnpm check` xanh.
- [ ] A2. Quyết định số phận 5 file `src/shared/ui/*` đang bị xoá mà chưa commit. Nếu xoá nhầm thì `git restore src/shared/ui`.
- [ ] A3. Đưa `max-lines` về 250, sửa câu "xem bảng ở mục trước" trong `next.config.ts`, rồi commit phần đã chạy đúng thành các commit nhỏ: cấu hình, tài liệu, `server/` kèm test của `client-ip`. Chưa commit `proxy.ts`, `http.ts`, `route.ts`.
- [ ] A4. Đưa `main` lên GitHub, mở PR từ `develop`, xem CI chạy lần đầu. Sau đó cố ý làm CI đỏ một lần rồi sửa cho xanh. Quyết định repo để public hay trả phí để bật bảo vệ `main`.
- [ ] A5. `crm-tool-nest`: mở PR cho `chore/update_package`. Trong PR đó thêm bước audit mức high vào CI, cho CI đọc phiên bản Node từ `.nvmrc`, xoá 8 file rỗng. Phần sửa auth chuyển sang một nhánh riêng.
- [ ] A6. Viết ADR-0001 bằng lời của bạn sau khi đọc mục 3.

**Chặng B: làm cho code đã gõ chạy đúng**

- [ ] B1. `proxy.ts`, test trước. Viết `proxy.test.ts` dạng bảng như `client-ip.test.ts`: các đường dẫn `/login`, `/forgot-password`, `/reset-password`, `/dashboard`, mỗi đường dẫn thử có và không có cookie.
- [ ] B2. `http.ts`, test trước. Sáu hành vi: 200 trả dữ liệu, 204, lỗi của Nest thành `ApiError`, 401 thì refresh một lần rồi gửi lại, refresh hỏng thì về `/login` với đúng tên tham số mà `proxy.ts` dùng, `post` gửi được body.
- [ ] B3. `route.ts`: nối `isSameOrigin` vào route, viết `route.test.ts` đủ năm ca trong lộ trình. Quyết định `api/healths` dùng để làm gì; lộ trình đặt tên là `healthz`.
- [ ] B4. Chạy lại năm dòng đầu của bảng "Kiểm tra cuối giai đoạn" trong lộ trình bằng `curl`.

**Chặng C: đi lại Giai đoạn 1 theo đúng thứ tự**

- [ ] C1. Bước 1 và 2: trang `/login` tĩnh, rồi form có kiểm tra. Hai bước này chưa làm, trang hiện chỉ trả về một chuỗi.
- [ ] C2. Bước 4 và 5: nối form với BFF, đăng nhập xong quay lại trang cũ.
- [ ] C3. Bước 6: quên và đặt lại mật khẩu.
- [ ] C4. Bước 8: đăng xuất và refresh. Làm bài phá 1, 2, 4, 7 ở mục 7.

**Chặng D: bước 7 bên Nest, làm xen kẽ với chặng C**

- [ ] D1. Tách cấu hình trong `main.ts` thành hàm dùng chung, rồi viết test e2e đầu tiên: đăng nhập và kiểm tra `exp - iat`.
- [ ] D2. Viết test e2e cho những gì đã sửa: đăng xuất thu hồi phiên, cookie hỏng bị xoá, rate limit, token thiếu `sessionId`.
- [ ] D3. Sửa các dòng "Còn mở" trong bảng bước 7 của [lộ trình](https://claude.ai/artifact/XJPoi7R11UM51EDbeAp1DE), mỗi dòng một test đỏ trước; riêng dòng `X-Forwarded-For` để tới Giai đoạn 6. Bảng đó là nơi duy nhất ghi lỗi backend, cập nhật ngày 17/11/2026.

## 3. Auth đã chốt: BFF chuyển tiếp cookie

Ngày 06/11/2026 đã chốt phương án 1 ở mục 3.2 và sửa lộ trình theo quyết định này. Mục này giữ lại lý do, những gì đã đo và những gì còn phải đổi.

### 3.1. Vì sao phải đổi: bản lộ trình cũ không khớp backend thật

Bản cũ có ghi rõ đây là giả định, nhưng phần phải sửa rộng hơn "hai file" như nó nói.

| Điểm          | Lộ trình giả định                         | `crm-tool-nest` thực tế                                                        |
| ------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| Đăng nhập     | Trả `{ user, accessToken, refreshToken }` | Chỉ trả `{ user }`; token nằm trong `Set-Cookie`                               |
| Refresh       | Nhận `{ refreshToken }` trong body        | Đọc cookie `refresh_token`, ghi cookie mới, trả `{ message }`                  |
| Gửi token     | Header `Authorization: Bearer`            | `JwtStrategy` chỉ đọc cookie `access_token`                                    |
| Tên cookie    | `crm_at`, `crm_rt`                        | `access_token`, `refresh_token`                                                |
| Cổng          | `3001`                                    | `8001`                                                                         |
| Định dạng lỗi | `{ code, message, fieldErrors }`          | Mặc định của Nest: `{ statusCode, message, error }`, validation trả mảng chuỗi |
| Phân trang    | `paginated`, `envelope`                   | Chưa có endpoint danh sách nào                                                 |

Chép nguyên code Giai đoạn 1 của bản cũ thì `tokenPairSchema` sẽ parse thất bại ở mọi lần đăng nhập, và mọi request cần đăng nhập đều nhận 401 vì backend không đọc Bearer.

Các điểm trên đã được đo với Postgres, Redis và `crm-tool-nest` thật ngày 06/11/2026, qua một bản sao tạm của frontend (`next build`, `next start`):

| Phép thử                                      | Kết quả                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| Đăng nhập qua BFF                             | 201, chỉ có `{ user }`, hai dòng `Set-Cookie` riêng, đều `HttpOnly`             |
| Gửi `Authorization: Bearer` thẳng tới Nest    | 401                                                                             |
| `GET /api/auth/me` có cookie, không có cookie | 200, 401                                                                        |
| Refresh cách lần phát token trước hơn 1 giây  | 201, hai cookie mới; dùng lại refresh token cũ thì 401                          |
| `POST` từ origin khác                         | 403 `BFF_CROSS_ORIGIN`                                                          |
| Đoạn path chứa `../`                          | 400 `BFF_INVALID_PATH`                                                          |
| Phiên ghi trong DB                            | Đúng `user-agent`; `ip` là `::1` của server Next vì Nest chưa bật `trust proxy` |

Chưa đo: trường hợp thành công của quên mật khẩu và đặt lại mật khẩu, vì hai luồng này gửi mail và đổi mật khẩu thật. Phần đó mới đọc từ code.

Việc đầu tiên của Giai đoạn 1 vẫn là tự làm lại: gọi `POST http://localhost:8001/api/auth/login` với `{ "email", "password", "rememberMe" }` bằng `curl -i` và tự đọc `Set-Cookie`.

### 3.2. Ba phương án cho ADR-0001

**Phương án 1: BFF chuyển tiếp cookie (đã chốt).** Trình duyệt gọi `/api/*` của Next, BFF chuyển lên Nest. Nest vẫn là bên phát token; BFF chỉ gửi lên đúng hai cookie cần thiết và chuyển `Set-Cookie` về.

- Được: backend gần như giữ nguyên, bỏ được ba route auth riêng, cùng origin nên không cần CORS, `proxy.ts` đọc được cookie.
- Mất: thêm một chặng mạng, phải xử lý `Set-Cookie` qua BFF cho đúng.

**Phương án 2: giữ code lộ trình, sửa backend.** Nest trả token trong JSON và nhận Bearer.

- Được: dùng được code mẫu.
- Mất: phải sửa luồng auth đang chạy, token đi qua code của server Next, và không có lợi ích nào so với phương án 1.

**Phương án 3: trình duyệt gọi thẳng Nest.** Backend đã bật CORS cho cách này.

- Được: ít code nhất.
- Mất: khác domain thì `proxy.ts` không thấy cookie nên không chặn được trang, Server Component không có cookie để gọi backend, và `SameSite=None` mở rộng bề mặt CSRF.

ADR phải ghi lại vì sao bỏ hai phương án kia. Đó mới là phần có giá trị của ADR, nên hãy viết bằng lời của bạn, đừng chép bản mẫu.

### 3.3. Những gì đổi theo phương án 1

Frontend:

- `cookie-names.ts`: dùng đúng `access_token`, `refresh_token`.
- `app/api/[...path]/route.ts`: bỏ `Authorization`, gửi lên đúng hai cookie đó, chuyển từng cookie về bằng `upstream.headers.getSetCookie()` và `append`.
- Cùng route đó: gửi thêm `user-agent` và `x-forwarded-for`. Backend ghi `req.ip` và `user-agent` vào phiên đăng nhập; thiếu hai giá trị này thì mọi phiên đều mang dấu của server Next. Phía Nest cần bật `trust proxy`.
- Bỏ phần ghi cookie trong `session.ts` và ba route `api/auth/*`: route catch-all đã lo hết.
- `shared/api/http.ts`: loại `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/reset-password` khỏi luồng tự refresh, vì ở đó 401 có nghĩa riêng: sai mật khẩu, token mail hết hạn. Điều kiện `startsWith("/auth/")` của bản cũ khiến `GET /auth/me` không tự refresh khi gặp 401.
- `shared/api/errors.ts`: `toApiError` đọc dạng lỗi của Nest, trong đó `message` có thể là chuỗi hoặc mảng.
- `proxy.ts`: tách `/reset-password` khỏi nhóm chỉ dành cho khách, để link trong mail mở được cả khi đang đăng nhập.
- Đăng xuất: xong thì dùng `window.location.assign("/login")`. Với `cacheComponents`, trang cũ được giữ bằng `<Activity>`, nên `router.push` để lại state của người dùng trước (`02-guides/preserving-ui-state.md`, mục State and authentication).
- Form đăng nhập phải gửi `rememberMe` dạng boolean vì DTO bắt buộc trường này.

Backend: toàn bộ việc cần sửa nằm trong lộ trình, ở bước 7 của Giai đoạn 1 và mục "Bên backend" của từng giai đoạn, kèm mức độ và kết quả đo.

### 3.4. Backend còn thiếu gì cho các giai đoạn sau

Lộ trình đã gộp phần này: mục "Backend hiện có gì, còn thiếu gì" là bảng hiện trạng, còn mỗi giai đoạn có danh sách việc riêng. Từ Giai đoạn 3, mỗi feature đi theo sáu bước của một lát dọc trong lộ trình.

Tổng cộng khoảng 22 tuần bán thời gian; cộng bốn lát cắt ở mục 8 là 5 đến 6 tháng. Hãy giữ thứ tự, đừng giữ số tuần.

### 3.5. Một chỉnh sửa nhỏ ở Giai đoạn 2

Lộ trình tạo `QueryClient` bằng `useState`. Docs của bản đang cài (`02-guides/client-side-data-fetching/tanstack-query.md`) dùng hàm `getQueryClient()`: mỗi lần render ở server một client mới, trình duyệt dùng chung một client. Docs cũng đặt provider ở layout gần nhất cần nó. Hãy làm theo docs và đặt provider ở `(dashboard)/layout.tsx`, để trang công khai ở lát 4 không phải tải TanStack Query.

## 4. Cách học mỗi buổi

Một buổi 60 đến 90 phút có năm bước:

1. **Đoán trước (5 phút).** Viết hai dòng: code sẽ nằm ở đâu, chạy lên sẽ thấy gì. Đoán sai là phần học có giá trị nhất.
2. **Tự làm (30 đến 50 phút).** Gõ tay, không dán từ lộ trình. Kẹt quá 15 phút thì đọc docs, rồi mới hỏi gợi ý.
3. **Phá có chủ đích (10 phút).** Làm một bài phá ở mục 7. Đoán kết quả, chạy, đọc kỹ lỗi, khôi phục lại.
4. **Giải thích lại (5 phút).** Đóng file, viết 3 đến 5 câu giải thích vì sao code như vậy. Không viết được nghĩa là chưa hiểu.
5. **Ghi nhật ký (2 phút).** Ghi vào [nhat-ky-hoc.md](nhat-ky-hoc.md), kèm việc đầu tiên của buổi sau để lần sau vào việc ngay.

Mỗi tuần dành 30 phút cho hai việc: trả lời lại câu "Tự trả lời" của các giai đoạn đã qua mà không nhìn tài liệu, rồi đọc diff tuần trước như đang review PR của người khác. Câu nào trả lời không được thì đưa sang tuần sau.

Mỗi khi xong một giai đoạn: chạy lại cổng, cập nhật `docs/patterns.md`, viết 5 dòng tổng kết "giữ gì, đổi gì".

## 5. Giảm dần sự hỗ trợ

Lộ trình lặp tám bước cho mỗi feature. Nếu lần nào cũng nhìn mẫu, bạn chỉ luyện kỹ năng chép. Hãy giảm dần sự trợ giúp qua từng feature:

| Feature   | Mức hỗ trợ   | Luật chơi                                                                                |
| --------- | ------------ | ---------------------------------------------------------------------------------------- |
| Contacts  | Có mẫu       | Gõ tay từ lộ trình. Mỗi file viết được một câu "file này tồn tại để làm gì".             |
| Companies | Tự nhớ       | Đóng lộ trình, chỉ xem `docs/patterns.md` do chính bạn viết. Xong mới mở mẫu ra so sánh. |
| Tasks     | Test trước   | Viết test hành vi trước, rồi code cho test xanh. Không mở mẫu.                           |
| Deals     | Bài toán mới | Không có mẫu cho kéo thả. Tự viết ADR trước, tự làm, AI chỉ được review.                 |

Bên Nest cũng giảm dần như vậy: `contacts` nhìn theo module `auth`, các module sau tự dựng.

Ghi lại số lần phải tra cứu và thời gian làm mỗi feature. Con số giảm dần là bằng chứng bạn đang tiến bộ.

## 6. Dùng AI mà vẫn học được

AI viết hộ thì code tiến nhanh còn bạn đứng yên. Đặt ra bốn mức và chọn mức trước khi hỏi:

| Mức         | Dùng khi                                                     | Cách hỏi                                                                         |
| ----------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| 0. Tự làm   | Lần đầu làm một kỹ năng, mọi bài phá                         | Chưa hỏi                                                                         |
| 1. Gợi ý    | Đã kẹt quá 15 phút và đã đọc docs                            | "Mình đã thử X, kết quả Y. Đừng viết code, hãy hỏi ngược hoặc chỉ đoạn cần đọc." |
| 2. Review   | Đã có code chạy được                                         | "Review diff này như senior. Chỉ nêu vấn đề, mức độ và lý do, để mình tự sửa."   |
| 3. Làm thay | Việc đã tự làm ít nhất hai lần, hoặc không phải mục tiêu học | "Viết giúp phần X, rồi giải thích vì sao chọn cách đó."                          |

Hai câu hỏi luôn có ích ở mọi mức: "Hỏi mình 5 câu về phần này rồi chấm" và "Mình hiểu X là như sau, sai ở đâu?".

Hai nguyên tắc đi kèm:

- **Code AI viết chưa được tính là đúng cho tới khi bạn chạy nó và giải thích được.** Lộ trình này là ví dụ: viết rất thuyết phục, nhưng tác giả không nhìn thấy backend nên phần auth lệch ở mọi điểm quan trọng. Nguồn sự thật là code đang chạy và docs của bản đang cài.
- **Không học từ trí nhớ của AI về Next.js.** Bản 16.4 khác nhiều so với dữ liệu huấn luyện của hầu hết mô hình. Yêu cầu trích dẫn file docs cụ thể.

`AGENTS.md` đã ghi mức 1 và 2 làm mặc định, nên agent sẽ gợi ý và review thay vì viết thay. Khi cần mức 3, nói rõ "viết giúp". Bên `crm-tool-nest` cũng làm theo cách này: viết test đỏ trước, tự sửa cho xanh, rồi nhờ review.

## 7. Học gì ở từng giai đoạn

Bài phá chỉ ghi việc cần làm, không ghi kết quả. Hãy tự đoán trước, rồi chạy để kiểm chứng. Dòng "Bên Nest" là phần backend cần hiểu khi làm danh sách việc trong lộ trình.

### Giai đoạn 0: đóng nốt

**Hiểu được:** CI bảo vệ điều gì mà husky không bảo vệ được, `output: "standalone"` tạo ra gì.

**Bên Nest:** vì sao chép `.env.example` sai thì server không chạy, `engines` trong `package.json` có tác dụng gì, đọc kết quả `pnpm audit` thế nào.

**Đọc:** `03-api-reference/05-config/01-next-config-js/output.md`, `02-guides/ci-build-caching.md`.

**Bài phá:** làm CI đỏ ba lần bằng ba cách: lỗi kiểu, vi phạm ranh giới import, vượt ngân sách bundle.

### Giai đoạn 1: auth, BFF, biến môi trường

**Hiểu được:** thuộc tính của cookie, same-origin khác same-site ra sao, XSS khác CSRF ra sao, Route Handler và `proxy.ts` chạy khi nào, vì sao refresh chỉ có một cửa.

**Bên Nest:** thứ tự chạy của guard, strategy và pipe; claim `iat`, `exp` trong JWT; vì sao test e2e phải dùng cùng cấu hình với `main.ts`.

**Đọc:** `01-getting-started/15-route-handlers.md`, `01-getting-started/16-proxy.md`, `02-guides/backend-for-frontend.md`, `02-guides/authentication.md`, `02-guides/data-security.md`, `02-guides/environment-variables.md`, `02-guides/instrumentation.md`. Ngoài Next: MDN Cookies, OWASP CSRF.

**Bài phá:**

1. Xoá `access_token` trong DevTools rồi thao tác. Theo dõi tab Network: request nào 401, request nào được gửi lại.
2. Xoá cả hai cookie rồi tải lại trang đang mở.
3. Ở BFF, dùng `headers.get("set-cookie")` thay cho `getSetCookie()`, đăng nhập rồi xem Application > Cookies.
4. Sau khi sửa hạn token ở bước 7, mở hai tab, chờ access token hết hạn rồi tải lại cả hai cùng lúc. `refreshInFlight` chỉ gộp request trong một tab, còn backend xoay vòng refresh token. Ghi lại chuyện xảy ra, rồi thử sửa bằng Web Locks API.
5. Tắt backend rồi thao tác. Xem BFF trả mã gì và UI hiện gì.
6. Bỏ `API_BACKEND_URL` rồi chạy `pnpm start`.
7. Sửa `refresh_token` trong DevTools thành chuỗi bất kỳ, xoá `access_token`, rồi tải lại trang. Làm một lần trước và một lần sau khi sửa `auth.controller.ts` bên Nest.

**Tự trả lời:**

- `httpOnly` chống được gì và không chống được gì? `SameSite` thì sao?
- Vì sao Server Component không ghi được cookie còn Route Handler thì được?
- Vì sao `proxy.ts` chỉ kiểm tra cookie có tồn tại? Kiểm tra thật nằm ở đâu?
- Năm request cùng nhận 401 thì `refreshInFlight` làm gì?
- Biến `NEXT_PUBLIC_*` khác biến thường ở thời điểm nào?

### Giai đoạn 2: khung UI và state

**Hiểu được:** React render thế nào, ranh giới server và client, layout lồng nhau, Suspense và streaming, `loading.tsx`, `error.tsx`, `not-found.tsx`, bảng "ai giữ state nào", vì sao trang không unmount khi chuyển route.

**Bên Nest:** vòng đời một request từ middleware, guard, interceptor, pipe tới filter; Guard khác Policy của Laravel ở đâu.

**Đọc:** `01-getting-started/03-layouts-and-pages.md`, `04-linking-and-navigating.md`, `05-server-and-client-components.md`, `10-error-handling.md`, `02-guides/server-and-client-boundary.md`, `02-guides/preserving-ui-state.md`, `02-guides/streaming.md`. Ngoài Next: Render and Commit, State as a Snapshot, You Might Not Need an Effect.

**Bài phá:**

1. Đặt `"use client"` lên layout của dashboard, rồi chạy `pnpm build` và `pnpm bundle:check`. So số KB và bảng route.
2. Đọc `cookies()` ở đầu layout, ngoài `<Suspense>`, rồi build. Đọc kỹ thông báo lỗi.
3. Mở dialog, gõ dở form, chuyển trang rồi quay lại. Giải thích kết quả.
4. Ném lỗi trong một component. `error.tsx` nào bắt được? Thêm một `error.tsx` thấp hơn rồi thử lại.
5. Import một file có `server-only` vào client component.

**Tự trả lời:**

- Khi nào component cần `"use client"`? Vì sao một file không ghi `"use client"` vẫn có thể chạy ở client?
- Có truyền được function từ Server Component xuống Client Component không? Vì sao?
- Vì sao `<Suspense>` ở layout gốc có thể không hiện fallback khi điều hướng phía client?
- Đặt state ở đâu: tab đang chọn, danh sách contact, ô đang gõ, sidebar thu gọn?

### Giai đoạn 3: Contacts

**Hiểu được:** TanStack Query là một cache chứ không phải chỗ gọi API, query key, `staleTime` và `gcTime`, huỷ request, form với React Hook Form, Zod ở biên dữ liệu, URL là state, test theo hành vi, form dùng được bằng bàn phím.

**Bên Nest:** migration của Drizzle, index, xoá mềm, vì sao mỗi tầng chỉ biết tầng ngay dưới nó.

**Đọc:** `02-guides/client-side-data-fetching/tanstack-query.md`, `02-guides/forms.md`, `02-guides/testing/vitest.md`. Ngoài Next: TanStack Query Keys, Testing Library About Queries, MSW.

**Bài phá:**

1. Bỏ `search` khỏi query key. Gõ tìm kiếm rồi giải thích màn hình.
2. Đổi `staleTime` thành 0, rồi thành 5 phút. Xem tab Network khi quay lại trang.
3. Cho MSW trả một contact thiếu `email`.
4. Gõ nhanh ô tìm kiếm và xem request bị huỷ. Bỏ `signal` rồi xem lại.
5. Rút chuột, làm trọn luồng tạo contact bằng bàn phím. Ghi lại chỗ bị kẹt.
6. Đổi tên class CSS rồi đổi nhãn nút. Test nào đỏ, và như vậy có đúng không?

**Tự trả lời:**

- `staleTime` khác `gcTime` thế nào?
- Vì sao làm mới `lists()` chứ không làm mới `all`?
- Vì sao bộ lọc nằm trên URL chứ không trong `useState`?
- Test này bảo vệ hành vi gì của người dùng?

### Giai đoạn 4: Companies, Tasks, Deals

**Hiểu được:** khi nào nên trừu tượng hoá, cập nhật lạc quan và hoàn tác, kéo thả dùng được bằng bàn phím, tách tính toán thành hàm thuần.

**Bên Nest:** transaction, join thay cho N+1, cách một module dùng dữ liệu của module khác.

**Đọc:** TanStack Query Optimistic Updates.

**Bài phá:**

1. Cho MSW trả 500 khi kéo deal.
2. Bỏ `cancelQueries`, làm API chậm 2 giây, kéo liên tiếp hai deal.
3. Sau Companies và Tasks, liệt kê phần lặp lại. Chỉ rút thành code chung những gì thật sự giống nhau, rồi ghi lý do.

**Tự trả lời:**

- Cập nhật lạc quan phù hợp và không phù hợp với loại thao tác nào?
- Vì sao `moveDeal` là hàm thuần? Việc đó đổi cách test ra sao?
- Trừu tượng hoá quá sớm gây hại thế nào so với lặp code?

### Giai đoạn 5: Dashboard, Reports

**Hiểu được:** JS first-load gồm những gì, code splitting, LCP, INP, CLS, đọc bundle analyzer, dùng React Profiler và Performance panel.

**Bên Nest:** đọc `EXPLAIN ANALYZE`, khi nào cần index, khi nào mới cần cache.

**Đọc:** `02-guides/lazy-loading.md`, `02-guides/package-bundling.md`, `03-api-reference/04-functions/use-report-web-vitals.md`. Ngoài Next: Web Vitals, INP trên web.dev.

**Bài phá:**

1. Import Recharts tĩnh, xem `pnpm bundle:check`, rồi đổi sang `next/dynamic`.
2. Chạy `pnpm next analyze` và tìm ba module nặng nhất của `/dashboard`.
3. Tạo bảng 5.000 dòng, đo khi gõ lọc, tìm chỗ nghẽn bằng Performance panel.

**Tự trả lời:**

- LCP, INP, CLS đo điều gì, và mỗi chỉ số thường hỏng vì nguyên nhân nào?
- React Compiler giải quyết được loại chậm nào và không giải quyết được loại nào?

### Giai đoạn 6: hardening và triển khai

**Hiểu được:** standalone output, build một lần chạy nhiều nơi, CSP, E2E trên bản production, log an toàn, rollback.

**Bên Nest:** chạy migration lúc deploy, log có cấu trúc, healthcheck báo điều gì.

**Đọc:** `02-guides/self-hosting.md`, `02-guides/production-checklist.md`, `02-guides/content-security-policy.md`, `02-guides/testing/playwright.md`, `02-guides/open-telemetry.md`, `02-guides/memory-usage.md`. Với Playwright, trang ẩn bởi `<Activity>` vẫn còn trong DOM, nên dùng `getByRole` và các selector có lọc theo hiển thị.

**Bài phá:**

1. Deploy một bản lỗi, rollback về image cũ và bấm giờ.
2. Bật CSP dạng report-only rồi đọc các vi phạm.
3. Tắt backend trên staging. Healthcheck nói gì, người dùng thấy gì?
4. Viết postmortem ngắn cho một sự cố, thật hoặc cố ý tạo ra.

**Tự trả lời:**

- Vì sao image không nên nướng cứng URL backend lúc build?
- CSP dùng nonce đánh đổi điều gì?
- Log nào không bao giờ được ghi?

## 8. Bốn lát cắt Next.js mà lộ trình chưa chạm tới

ADR trong lộ trình chọn "trang là vỏ tĩnh, dữ liệu tải ở client". Với CRM nội bộ đây là lựa chọn đúng, nhưng có một hệ quả với việc học: làm đúng lộ trình thì bạn sẽ có một SPA React đặt trong Next, và gần như không chạm tới phần làm nên Next.js: lấy dữ liệu ở server, cache, Server Actions, streaming, trang tĩnh, SEO.

Bốn lát cắt dưới đây lấp khoảng trống đó mà không phá kiến trúc. Mỗi lát khoảng 2 đến 4 buổi. Lộ trình quy định đổi cách làm thì phải có ADR, nên mỗi lát là một ADR ngắn và kết thúc bằng một phép so sánh có số đo.

### Lát 1: tên người dùng trên header (cuối Giai đoạn 2)

Một Server Component trong `<Suspense>` đọc cookie, gọi `/auth/me`, dùng `"use cache: private"`, gom vào hàm `getCurrentUser()` theo mẫu Data Access Layer.

- **Học được:** `cookies()`, vì sao bắt buộc có Suspense, streaming trong layout, chia dữ liệu cho client component bằng `use()` và Context.
- **Đọc:** `02-guides/authentication-with-cache-components.md`.
- **So sánh:** làm `/auth/me` chậm 2 giây. Khung trang có bị chặn không?

### Lát 2: danh mục dùng chung bằng `use cache` (sau Giai đoạn 3)

Chọn dữ liệu ít đổi và giống nhau với mọi người dùng, như phòng ban hoặc các bước pipeline. Đọc bằng `"use cache"`, `cacheLife`, `cacheTag`; sửa bằng Server Action rồi `updateTag`. Lát này hợp để làm luôn module `departments` bên Nest.

- **Học được:** cache key, vòng đời cache, invalidation, khi nào Server Action hợp hơn BFF.
- **Bài khó:** hàm `use cache` không đọc được `cookies()`, và không được truyền token làm tham số vì tham số nằm trong cache key dạng văn bản thuần. Bạn phải tự nghĩ cách backend cho phép đọc dữ liệu này.
- **Đọc:** `01-getting-started/07-mutating-data.md`, `08-caching.md`, `09-revalidating.md`, `02-guides/how-revalidation-works.md`, `03-api-reference/01-directives/use-cache.md`.
- **So sánh:** số lần gọi backend trước và sau khi cache.

### Lát 3: dashboard render ở server (Giai đoạn 5)

Mỗi thẻ số liệu là một async Server Component trong `<Suspense>` riêng; biểu đồ là client component nạp lazy. Cố ý làm một thẻ chậm 2 giây.

- **Học được:** streaming, cách chia ranh giới Suspense, gọi backend từ server kèm cookie, và bài toán khó nhất: token hết hạn giữa lúc render ở server, khi Server Component không ghi được cookie.
- **Đọc:** `02-guides/streaming.md`, `02-guides/instant-navigation.md`, `02-guides/rendering-philosophy.md`.
- **So sánh:** JS first-load và thời gian thấy số liệu so với bản tải ở client.

### Lát 4: trang Web-to-Lead công khai (Giai đoạn 6)

Một trang giới thiệu công khai có form để khách để lại thông tin, gửi xong thành một lead trong CRM. Đây là tính năng CRM có thật, không phải bài tập giả.

- **Học được:** trang tĩnh, metadata, Open Graph, JSON-LD, sitemap, Server Action với `useActionState`, form chạy được khi chưa có JavaScript, rate limit, cho `proxy.ts` mở đường dẫn công khai.
- **Đọc:** `02-guides/public-static-pages.md`, `02-guides/forms.md`, `02-guides/server-actions.md`, `02-guides/data-security.md`, `01-getting-started/14-metadata-and-og-images.md`, `02-guides/json-ld.md`.
- **So sánh:** kiểm tra bảng route khi build: trang này có tĩnh không? Đối chiếu với lỗi của Livpark trong bản đánh giá (36/36 trang render động).

## 9. Từ Vue sang React: những chỗ thói quen đánh lừa bạn

Tài liệu cấu hình đã có từ điển Laravel và Vue sang Next.js. Bảng này bổ sung phần còn thiếu: mô hình render của React. Khác biệt gốc là Vue theo dõi đúng giá trị đã đổi, còn React chạy lại cả hàm component rồi so sánh kết quả.

| Trong Vue               | Trong React                                         | Bẫy thường gặp                                                            |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| `ref()` đổi là UI đổi   | `useState`, gọi `setX` để render lại                | Đọc `x` ngay sau `setX` vẫn ra giá trị cũ                                 |
| `list.push(item)`       | Tạo mảng mới: `[...list, item]`                     | Sửa trực tiếp thì màn hình không đổi                                      |
| `computed`              | Tính thẳng trong lúc render                         | Chép vào `useState` rồi đồng bộ bằng `useEffect`                          |
| `watch`                 | Xử lý trong event handler                           | Dùng `useEffect` như `watch`                                              |
| `onMounted`             | `useEffect` với mảng phụ thuộc rỗng                 | Quên cleanup; Strict Mode chạy effect hai lần ở dev để lộ lỗi này         |
| Composable chạy một lần | Hook chạy lại ở mỗi lần render                      | Gọi hook trong `if` hoặc vòng lặp                                         |
| `v-model`               | `value` với `onChange`, hoặc React Hook Form        | Quên `onChange` làm ô nhập bị khoá                                        |
| `v-if`                  | `&&` hoặc toán tử ba ngôi                           | `{count && <X />}` in ra số `0`                                           |
| `v-for` với `:key`      | `.map()` với `key`                                  | Dùng index làm key khiến state nhảy dòng khi đổi thứ tự                   |
| Slot                    | `children` hoặc prop                                | Tạo prop cấu hình dài thay vì ghép component                              |
| `provide`, `inject`     | Context                                             | Đặt giá trị đổi liên tục vào Context làm cả cây render lại                |
| `emit`                  | Truyền callback qua prop                            | Không có sự kiện nổi lên như component Vue                                |
| `<KeepAlive>`           | `<Activity>`, Next tự dùng khi có `cacheComponents` | Rời trang không unmount: form giữ dữ liệu cũ, effect chạy lại khi quay về |

Lỗi hay gặp nhất của người từ Vue sang là dùng effect để giữ dữ liệu phái sinh:

```tsx
// Thói quen từ watch: render thừa một lần, và có lúc hiển thị dữ liệu cũ
const [fullName, setFullName] = useState("")
useEffect(() => setFullName(`${contact.lastName} ${contact.firstName}`), [contact])

// Cách của React: tính ngay khi render
const fullName = `${contact.lastName} ${contact.firstName}`
```

Trước khi viết `useEffect`, hãy hỏi: có hệ thống nào bên ngoài React cần đồng bộ không? Nếu không, gần như chắc chắn bạn không cần effect. Dự án bật React Compiler nên cũng không cần viết `useMemo`, `useCallback` bằng tay.

Nền Vue là lợi thế. Hãy so sánh hai cách làm trong nhật ký, vì người hiểu được cả hai sẽ thấy rõ phần nào là ý tưởng chung và phần nào là chi tiết của framework.

## 10. Nền tảng Frontend bền hơn framework

Kiến thức riêng của Next có tuổi thọ ngắn. Ngay trong repo này: `middleware.ts` đã thành `proxy.ts`, `experimental.ppr` đã bị gỡ, và docs ghi rằng cờ `cacheComponents`, `partialPrefetching` sẽ bị bỏ ở bản major tiếp theo. Hãy dùng Next làm chỗ luyện tập, nhưng đầu tư nhiều hơn vào những mảng dưới đây, vì chúng vẫn dùng được khi bạn đổi framework.

| Nền tảng               | Luyện ngay trong CRM                                               |
| ---------------------- | ------------------------------------------------------------------ |
| HTTP và trình duyệt    | Cookie, cache header, CORS; đọc tab Network như đọc log            |
| JavaScript, TypeScript | Promise, closure, generic của `http.get<T>`, union cho trạng thái  |
| Hiệu năng              | Đo LCP, INP, CLS; đọc Performance panel; giữ ngân sách bundle      |
| Accessibility          | Bàn phím, label, focus, thử với trình đọc màn hình                 |
| Bảo mật                | XSS, CSRF, CSP, open redirect, kiểm tra dependency                 |
| Kiểm thử               | Test gì ở tầng nào, test hành vi thay vì chi tiết cài đặt          |
| CSS và design system   | Layout, responsive, token; tự viết một component không dùng shadcn |
| Kiến trúc Frontend     | Ranh giới module, luồng dữ liệu, ADR, nêu rõ đánh đổi              |
| Vận hành               | Deploy, rollback, log, giám sát, postmortem                        |
| Làm việc nhóm          | PR rõ ràng, review có lý do, ước lượng, chia nhỏ việc              |

Ba mức để tự đánh giá:

1. **Làm theo được:** có mẫu thì làm đúng và hiểu vì sao mẫu như vậy. Mục tiêu sau Contacts.
2. **Tự quyết được:** gặp bài toán không có mẫu thì tự đưa ra phương án, đo, viết ADR. Mục tiêu sau Deals và các lát cắt.
3. **Nâng được người khác:** đặt tiêu chuẩn, review tốt, hướng dẫn đồng nghiệp, làm cả dự án tốt lên. Mức này không luyện được một mình, nên phải làm ở công ty.

## 11. Biến dự án cá nhân thành kinh nghiệm thật

Thứ tạo ra kinh nghiệm là áp lực của điều kiện thật, không phải số dòng code.

1. **Có người dùng thật.** Deploy rồi mời vài đồng nghiệp hoặc bạn bè dùng. Lỗi do người khác gặp dạy nhiều hơn bài tập tự đặt ra.
2. **Có số đo.** Mỗi cải tiến ghi trước và sau. "Giảm JS từ X xuống Y KB" có giá trị hơn "đã tối ưu hiệu năng".
3. **Làm như có team.** Mọi thay đổi đi qua PR có mô tả, tự review như review người khác.
4. **Có sự cố và cách xử lý.** Giữ postmortem cho từng sự cố, dù nhỏ.
5. **Viết ra.** Từ nhật ký, viết 3 đến 4 bài ngắn, ví dụ "Từ Vue sang React: những gì mình phải quên" hay "Cookie đi qua BFF".
6. **Mang về công ty.** Mỗi giai đoạn chọn một thực hành để đề xuất ở dự án thật: CI, test hành vi, ADR, kiểm tra accessibility. Đây là cách duy nhất để luyện mức 3.
7. **Đọc code người khác.** Mỗi tuần đọc một PR hoặc một issue ở dự án bạn đang dùng, như TanStack Query hay shadcn.

Khi xong lộ trình, bạn nên kể được năm câu chuyện theo khung "vấn đề, phương án, quyết định, kết quả đo":

- Sửa hợp đồng auth giữa frontend và backend.
- Lỗi refresh giữa nhiều tab.
- Một lần giảm bundle hoặc cải thiện INP có số liệu.
- Một sự cố và cách rollback.
- Một quyết định bạn đã đổi ý, và lý do.

`crm-tool` là repo của công ty. Hãy học từ dạng bài toán ở đó (bảng lớn, cột tuỳ biến, thứ tự cột), nhưng không chép code, dữ liệu hay thông tin khách hàng sang repo cá nhân.

## Nguồn ngoài docs Next

**React:** [Thinking in React](https://react.dev/learn/thinking-in-react), [Render and Commit](https://react.dev/learn/render-and-commit), [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot), [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect), [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks), [Activity](https://react.dev/reference/react/Activity).

**Dữ liệu và test:** [TanStack Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates), [Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr), [Testing Library: About Queries](https://testing-library.com/docs/queries/about/), [MSW](https://mswjs.io/docs/), [Playwright Best Practices](https://playwright.dev/docs/best-practices).

**Nền tảng web:** [MDN Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies), [MDN HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API), [Web Vitals](https://web.dev/articles/vitals), [INP](https://web.dev/articles/inp), [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [OWASP XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), [WAI-ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/), [WCAG](https://www.w3.org/WAI/WCAG22/quickref/), [Patterns.dev](https://www.patterns.dev/).
