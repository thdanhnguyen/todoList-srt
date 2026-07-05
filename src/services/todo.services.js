const todoRepository = require('../repositories/todo.repositories.js');

exports.createTask = async (title, description, status) => {
    if(!title || title.trim() === ''){
        throw new Error("Tiêu đề không được để trống");
    }
    return await todoRepository.createTask(title, description, status);
}