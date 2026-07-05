const { pool} = require('../config/database.js');

exports.createTask = async (title, description, status) => {
    const query = `INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [title, description, status]);
    return result.rows[0];
}

exports.updateTask = async (id, title, description, status) => {
    const query = `UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *`;
    const result = await pool.query(query, [title, description, status, id]);
    return result.rows[0];
}

exports.updateTaskStatus = async (id, status) => {
    const query = `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
}