const todoRepository = require('../repositories/todo.repositories.js');

exports.createTask = async (title, description, status) => {
    if(!title || title.trim() === ''){
        throw new Error("Tiêu đề không được để trống");
    }
    return await todoRepository.createTask(title, description, status);
}

exports.updateTask = async (id, title, description, status) => {
    if(!title || title.trim() === ''){
        throw new Error("Tiêu đề không được để trống");
    }
    return await todoRepository.updateTask(id, title, description, status);
}

exports.updateTaskStatus = async (id, status) => {
    if(!status || !['pending', 'completed'].includes(status)){
        throw new Error("Trạng thái không hợp lệ");
    }
    return await todoRepository.updateTaskStatus(id, status);
}

exports.deleteTask = async (id) => {
    return await todoRepository.deleteTask(id);
}

exports.getAllTask = async (search, status, page, limit) => {
    const offset = (page - 1) * limit;
    const tasks = await todoRepository.getAllTask(search, status, limit, offset);
    const totalCount = await todoRepository.countAllTask(search, status);
    
    return {
        tasks: tasks,
        pagination: {
            total_items: parseInt(totalCount),
            total_pages: Math.ceil(totalCount / limit),
            current_page: page,
            limit: limit,
            has_next: page < Math.ceil(totalCount / limit),
            has_prev: page > 1,
        }
    }
}

exports.getTaskById = async (id) => {
    return await todoRepository.getTaskById(id);
}

exports.countAllTask = async (search, status) => {
    return await todoRepository.countAllTask(search, status);
}
