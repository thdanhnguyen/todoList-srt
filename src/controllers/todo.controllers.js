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