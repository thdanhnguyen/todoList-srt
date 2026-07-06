# ✦ TodoList — Ứng dụng Quản Lý Công Việc

Ứng dụng **Fullstack Todo List** với giao diện web hiện đại (Dark Mode) và REST API mạnh mẽ. Được xây dựng theo kiến trúc **Controller → Service → Repository**, đóng gói hoàn toàn bằng **Docker**.

---

## 🚀 Tính năng

- **Thêm / Sửa / Xóa** công việc
- **Đánh dấu hoàn thành / chưa hoàn thành** (toggle trực tiếp trên giao diện)
- **Tìm kiếm** theo tên công việc (Debounce, không phân biệt hoa thường)
- **Lọc** theo trạng thái: Tất cả / Đang làm / Hoàn thành
- **Phân trang & Sắp xếp** (mới nhất lên đầu, tự động điều hướng trang)
- **Validate dữ liệu đầu vào** (Middleware kiểm tra tiêu đề, trạng thái)
- **Giao diện Responsive**
- **Docker** — Khởi chạy toàn bộ ứng dụng bằng 1 lệnh

---

## 🛠 Công nghệ sử dụng

| Tầng | Công nghệ |
|------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 14 (Raw SQL với `pg`) |
| **Frontend** | HTML5, Vanilla CSS, Vanilla JavaScript |
| **Container** | Docker, Docker Compose |

---

## 📁 Cấu trúc dự án

```
todoList-srt/
├── src/
│   ├── config/
│   │   ├── database.js       
│   │   └── init.sql          
│   ├── controllers/
│   │   └── todo.controllers.js
│   ├── services/
│   │   └── todo.services.js
│   ├── repositories/
│   │   └── todo.repositories.js
│   ├── middlewares/
│   │   └── validateTodo.js   
│   ├── routes/
│   │   └── todo.routes.js
│   ├── public/               
│   │   ├── index.html
│   │   ├── style.css
│   │   └── main.js
│   └── app.js
├── .env
├── Dockerfile
├── docker-compose.yaml
└── package.json
```

---

## ⚙️ Hướng dẫn cài đặt & Chạy dự án

### Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã được cài đặt và đang chạy.

### Bước 1: Clone dự án

```bash
git clone https://github.com/thdanhnguyen/todoList-srt.git
cd todoList-srt
```

### Bước 2: Khởi chạy bằng Docker Compose

```bash
docker compose up -d --build
```

> Lệnh này sẽ tự động:
> - Build image Node.js cho ứng dụng
> - Khởi động container PostgreSQL
> - Chạy script `init.sql` để tạo bảng và trigger tự động
> - Khởi động server Express tại cổng **3000**

### Bước 3: Truy cập ứng dụng

| | URL |
|---|---|
| 🌐 **Giao diện Web** | http://localhost:3000 |

### Dừng ứng dụng

```bash
docker compose down
```


### Lấy danh sách công việc

```
GET /api/todo
```

**Query Parameters (Tùy chọn):**

| Tham số | Kiểu | Mô tả | Mặc định |
|---------|------|--------|----------|
| `search` | string | Tìm theo tên công việc | — |
| `status` | string | Lọc: `pending` hoặc `completed` | — |
| `page` | number | Trang hiện tại | `1` |
| `limit` | number | Số lượng item mỗi trang | `5` |

**Ví dụ:**
```
GET /api/todo?search=docker&status=pending&page=1&limit=5
```

**Response:**
```json
{
  "message": "Lấy danh sách thành công",
  "data": [ ... ],
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

---

### Xem chi tiết 1 công việc

```
GET /api/todo/:id
```

---

### Thêm công việc mới

```
POST /api/todo
```

**Body (JSON):**
```json
{
  "title": "Học Docker",
  "description": "Thực hành volume và network",
  "status": "pending"
}
```

---

### Cập nhật công việc

```
PUT /api/todo/:id
```

**Body (JSON):** Tương tự như thêm mới.

---

### Cập nhật trạng thái

```
PUT /api/todo/:id/status
```

**Body (JSON):**
```json
{
  "status": "completed"
}
```

---

### Xóa công việc

```
DELETE /api/todo/:id
```

---

## 🗄 Schema Database

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

> Trường `updated_at` được tự động cập nhật bởi **Database Trigger** mỗi khi có thay đổi.
