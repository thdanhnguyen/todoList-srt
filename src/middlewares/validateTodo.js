exports.validateTaskInput = (req, res, next) => {
    const {title, status} = req.body;
    if(!title || title.trim() === ''){
        return res.status(400).json({
            message: "Tiêu đề không được để trống",
        })
    }
    if(status && !['pending', 'completed'].includes(status)){
        return res.status(400).json({
            message: "Trạng thái không hợp lệ",
        })
    }
    next();
}