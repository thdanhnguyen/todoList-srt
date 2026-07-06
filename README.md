# TodoList

Ứng dụng quản lý công việc Fullstack, xây dựng theo kiến trúc Controller - Service - Repository, đóng gói bằng Docker.

## Tính năng

- Thêm, sửa, xóa công việc
- Đánh dấu hoàn thành / chưa hoàn thành
- Tìm kiếm theo tên (không phân biệt hoa thường)
- Lọc theo trạng thái: Tất cả / Đang làm / Hoàn thành
- Phân trang và sắp xếp theo thời gian tạo
- Validate dữ liệu đầu vào qua Middleware
- Giao diện Responsive (Desktop & Mobile)

## Công nghệ

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL 14, thư viện `pg` (Raw SQL)
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Container:** Docker, Docker Compose

## Cấu trúc dự án

```
src/
├── config/
│   ├── database.js
│   └── init.sql
├── controllers/
│   └── todo.controllers.js
├── services/
│   └── todo.services.js
├── repositories/
│   └── todo.repositories.js
├── middlewares/
│   └── validateTodo.js
├── routes/
│   └── todo.routes.js
└── public/
    ├── index.html
    ├── style.css
    └── main.js
```

## Cài đặt và chạy

**Yêu cầu:** Docker Desktop đang chạy.

```bash
# 1. Clone dự án
git clone https://github.com/thdanhnguyen/todoList-srt.git
cd todoList-srt

# 2. Khởi chạy
docker compose up -d --build

# 3. Dừng ứng dụng
docker compose down
```

Sau khi khởi chạy, truy cập: `http://localhost:3000`

> Lần đầu khởi động, Docker tự động chạy `init.sql` để tạo bảng và trigger trong PostgreSQL.

## API

Base URL: `http://localhost:3000/api/todo`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lấy danh sách công việc (hỗ trợ search, filter, phân trang) |
| GET | `/:id` | Lấy chi tiết 1 công việc |
| POST | `/` | Thêm công việc mới |
| PUT | `/:id` | Cập nhật công việc |
| PUT | `/:id/status` | Cập nhật trạng thái |
| DELETE | `/:id` | Xóa công việc |

### Query parameters cho GET /

| Tham số | Mô tả | Mặc định |
|---------|-------|----------|
| `search` | Tìm theo tên | — |
| `status` | `pending` hoặc `completed` | — |
| `page` | Trang hiện tại | `1` |
| `limit` | Số item mỗi trang | `5` |

**Ví dụ:**
```
GET /api/todo?search=docker&status=pending&page=1&limit=5
```

**Response:**
```json
{
  "message": "Lấy danh sách thành công",
  "data": [],
  "pagination": {
    "total_items": 11,
    "total_pages": 3,
    "current_page": 1,
    "limit": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

### Body cho POST và PUT

```json
{
  "title": "Học Docker",
  "description": "Thực hành volume và network",
  "status": "pending"
}
```

## Database Schema

```sql
CREATE TYPE task_status AS ENUM('pending', 'completed');

CREATE TABLE tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      task_status DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Trường `updated_at` được cập nhật tự động bằng Database Trigger.
