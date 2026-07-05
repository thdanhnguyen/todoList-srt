const API_BASE = '/api/todo';
const LIMIT_PER_PAGE = 5;

let state = {
    tasks: [],
    pagination: {},
    currentPage: 1,
    currentSearch: '',
    currentStatus: '',
    searchTimer: null,
    deleteTargetId: null,
};

const DOM = {
    taskList: document.getElementById('task-list'),
    skeleton: document.getElementById('loading-skeleton'),
    emptyState: document.getElementById('empty-state'),
    paginationContainer: document.getElementById('pagination-container'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    pageNumbers: document.getElementById('page-numbers'),

    statTotal: document.getElementById('stat-total'),
    statPending: document.getElementById('stat-pending'),
    statCompleted: document.getElementById('stat-completed'),

    searchInput: document.getElementById('search-input'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    btnAddTask: document.getElementById('btn-add-task'),

    taskModal: document.getElementById('task-modal'),
    modalTitle: document.getElementById('modal-title'),
    taskForm: document.getElementById('task-form'),
    taskId: document.getElementById('task-id'),
    taskTitle: document.getElementById('task-title'),
    taskDescription: document.getElementById('task-description'),
    taskStatus: document.getElementById('task-status'),
    titleError: document.getElementById('title-error'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancel: document.getElementById('btn-cancel'),

    deleteModal: document.getElementById('delete-modal'),
    btnCancelDelete: document.getElementById('btn-cancel-delete'),
    btnConfirmDelete: document.getElementById('btn-confirm-delete'),
    toastContainer: document.getElementById('toast-container'),
};

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Đã xảy ra lỗi từ server');
    }
    return data;
}

async function fetchTasks() {
    showSkeleton(true);
    try {
        const params = new URLSearchParams({
            page: state.currentPage,
            limit: LIMIT_PER_PAGE,
        });
        if (state.currentSearch) params.set('search', state.currentSearch);
        if (state.currentStatus) params.set('status', state.currentStatus);

        const data = await apiRequest(`?${params.toString()}`);

        state.tasks = data.data || [];
        state.pagination = data.pagination || {};

        const totalPages = state.pagination.total_pages || 1;
        if (state.currentPage > totalPages && totalPages > 0) {
            state.currentPage = totalPages;
            fetchTasks();
            return;
        }

        renderTaskList();
        renderPagination();
        updateStats();
    } catch (err) {
        showToast('Không thể tải danh sách công việc!', 'error');
        console.error(err);
    } finally {
        showSkeleton(false);
    }
}

function renderTaskList() {
    DOM.taskList.innerHTML = '';

    if (state.tasks.length === 0) {
        DOM.emptyState.classList.remove('hidden');
        DOM.paginationContainer.classList.add('hidden');
        return;
    }

    DOM.emptyState.classList.add('hidden');

    state.tasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        DOM.taskList.appendChild(li);
    });
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.style.animationDelay = `${index * 50}ms`;

    const date = new Date(task.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });

    li.innerHTML = `
        <div class="task-checkbox">
            <button class="checkbox-btn" title="Đổi trạng thái" data-action="toggle" data-id="${task.id}" data-status="${task.status}">
                ${task.status === 'completed' ? '✓' : ''}
            </button>
        </div>
        <div class="task-content">
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <span class="task-status-badge ${task.status}">
                    ${task.status === 'pending' ? '🔵 Đang làm' : '✅ Hoàn thành'}
                </span>
                <span class="task-date">📅 ${date}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="action-btn edit" title="Sửa" data-action="edit" data-id="${task.id}">✏️</button>
            <button class="action-btn delete" title="Xóa" data-action="delete" data-id="${task.id}">🗑️</button>
        </div>
    `;
    return li;
}

async function updateStats() {
    try {
        const all = await apiRequest('?limit=1&page=1');
        const pending = await apiRequest('?limit=1&page=1&status=pending');
        const completed = await apiRequest('?limit=1&page=1&status=completed');

        DOM.statTotal.textContent = all.pagination?.total_items ?? 0;
        DOM.statPending.textContent = pending.pagination?.total_items ?? 0;
        DOM.statCompleted.textContent = completed.pagination?.total_items ?? 0;
    } catch (_) {}
}

function renderPagination() {
    const { total_pages, current_page, has_next, has_prev } = state.pagination;

    if (!total_pages || total_pages <= 1) {
        DOM.paginationContainer.classList.add('hidden');
        return;
    }

    DOM.paginationContainer.classList.remove('hidden');
    DOM.btnPrev.disabled = !has_prev;
    DOM.btnNext.disabled = !has_next;

    DOM.pageNumbers.innerHTML = '';
    for (let i = 1; i <= total_pages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-number-btn ${i === current_page ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => goToPage(i));
        DOM.pageNumbers.appendChild(btn);
    }
}

function goToPage(page) {
    const totalPages = state.pagination.total_pages || 1;
    state.currentPage = Math.max(1, Math.min(page, totalPages));
    fetchTasks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(task = null) {
    DOM.taskForm.reset();
    DOM.titleError.classList.add('hidden');
    DOM.taskTitle.classList.remove('error');

    if (task) {
        DOM.modalTitle.textContent = 'Chỉnh sửa công việc';
        DOM.taskId.value = task.id;
        DOM.taskTitle.value = task.title;
        DOM.taskDescription.value = task.description || '';
        DOM.taskStatus.value = task.status;
    } else {
        DOM.modalTitle.textContent = 'Thêm công việc mới';
        DOM.taskId.value = '';
        DOM.taskStatus.value = 'pending';
    }

    DOM.taskModal.classList.remove('hidden');
    setTimeout(() => DOM.taskTitle.focus(), 50);
}

function closeModal() {
    DOM.taskModal.classList.add('hidden');
}

DOM.taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = DOM.taskTitle.value.trim();
    if (!title) {
        DOM.titleError.classList.remove('hidden');
        DOM.taskTitle.classList.add('error');
        DOM.taskTitle.focus();
        return;
    }

    DOM.titleError.classList.add('hidden');
    DOM.taskTitle.classList.remove('error');

    const payload = {
        title,
        description: DOM.taskDescription.value.trim(),
        status: DOM.taskStatus.value,
    };

    const id = DOM.taskId.value;
    const btnSubmit = document.getElementById('btn-submit');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Đang lưu...';

    try {
        if (id) {
            await apiRequest(`/${id}`, { method: 'PUT', body: payload });
            showToast('Cập nhật công việc thành công!', 'success');
        } else {
            await apiRequest('', { method: 'POST', body: payload });
            showToast('Thêm công việc thành công!', 'success');
            state.currentPage = 1;
        }
        closeModal();
        fetchTasks();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Lưu công việc';
    }
});

function openDeleteModal(id) {
    state.deleteTargetId = id;
    DOM.deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    DOM.deleteModal.classList.add('hidden');
    state.deleteTargetId = null;
}

DOM.btnConfirmDelete.addEventListener('click', async () => {
    if (!state.deleteTargetId) return;
    DOM.btnConfirmDelete.disabled = true;
    DOM.btnConfirmDelete.textContent = 'Đang xóa...';
    try {
        await apiRequest(`/${state.deleteTargetId}`, { method: 'DELETE' });
        showToast('Xóa công việc thành công!', 'success');
        closeDeleteModal();
        if (state.tasks.length === 1 && state.currentPage > 1) {
            state.currentPage--;
        }
        fetchTasks();
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        DOM.btnConfirmDelete.disabled = false;
        DOM.btnConfirmDelete.textContent = 'Xóa ngay';
    }
});

async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
        await apiRequest(`/${id}/status`, { method: 'PUT', body: { status: newStatus } });
        showToast(newStatus === 'completed' ? '✅ Đã hoàn thành!' : '🔵 Đặt lại đang làm!', 'success');
        fetchTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

DOM.taskList.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, id, status } = btn.dataset;

    if (action === 'toggle') {
        await toggleStatus(id, status);
    } else if (action === 'edit') {
        try {
            const data = await apiRequest(`/${id}`);
            openModal(data.data);
        } catch (err) {
            showToast('Không thể tải thông tin công việc!', 'error');
        }
    } else if (action === 'delete') {
        openDeleteModal(id);
    }
});

DOM.searchInput.addEventListener('input', (e) => {
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
        state.currentSearch = e.target.value.trim();
        state.currentPage = 1;
        fetchTasks();
    }, 400);
});

DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        DOM.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentStatus = btn.dataset.status;
        state.currentPage = 1;
        fetchTasks();
    });
});

DOM.btnAddTask.addEventListener('click', () => openModal());
DOM.btnCloseModal.addEventListener('click', closeModal);
DOM.btnCancel.addEventListener('click', closeModal);
DOM.btnCancelDelete.addEventListener('click', closeDeleteModal);
DOM.btnPrev.addEventListener('click', () => goToPage(state.currentPage - 1));
DOM.btnNext.addEventListener('click', () => goToPage(state.currentPage + 1));

DOM.taskModal.addEventListener('click', (e) => {
    if (e.target === DOM.taskModal) closeModal();
});
DOM.deleteModal.addEventListener('click', (e) => {
    if (e.target === DOM.deleteModal) closeDeleteModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});

function showToast(message, type = 'info') {
    const icons = { success: '✅', error: '❌', info: '💬' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showSkeleton(show) {
    if (show) {
        DOM.skeleton.classList.remove('hidden');
        DOM.taskList.innerHTML = '';
        DOM.emptyState.classList.add('hidden');
    } else {
        DOM.skeleton.classList.add('hidden');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

fetchTasks();
