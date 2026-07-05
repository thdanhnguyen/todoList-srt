const todoService = require('../services/todo.services.js');

exports.createTask = async (req, res) => {
    try{
        const {title, description, status} = req.body;
        const task = await todoService.createTask(title, description, status)
        return res.status(201).json({
          task:task,  
        })
    }catch(err){
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: err.message
        })
    }
}

exports.updateTask = async (req, res) => {
    try{
        const {id} = req.params;
        const {title, description, status} = req.body;
        const task = await todoService.updateTask(id, title, description, status)
        return res.status(200).json({
          task:task,  
        })
    }catch(err){
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: err.message
        })
    }
}

exports.updateTaskStatus = async (req, res) => {
    try{
        const {id} = req.params;
        const {status} = req.body;
        const task = await todoService.updateTaskStatus(id, status)
        return res.status(200).json({
          task:task,  
        })
    }catch(err){
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: err.message
        })
    }
}

exports.deleteTask = async (req, res) => {
    try{
        const {id} = req.params;
        const task = await todoService.deleteTask(id)
        return res.status(200).json({
          message: "Xóa thành công",  
        })
    }catch(err){
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: err.message
        })
    }
}

exports.getAllTask = async (req, res) => {
    try{
        const {search, status} = req.query;
        const task = await todoService.getAllTask(search, status)
        return res.status(200).json({
            message: "Lấy danh sách thành công",
            data:task
        })
    }catch(err){
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: err.message
        })
    }
}

exports.getTaskById = async (req, res) => {
    try{
        const {id} = req.params;
        const task = await todoService.getTaskById(id)
        if(!task){
            return res.status(404).json({
                message: "Không tìm thấy công việc",
            })
        }
        return res.status(200).json({
            message: "Lấy chi tiết công việc thành công",
            data:task
        })
    }catch(err){
        return res.status(500).json({
            message: "Đã xảy ra lỗi",
            error: err.message
        })
    }
}

