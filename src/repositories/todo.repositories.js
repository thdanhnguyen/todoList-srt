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

exports.deleteTask = async (id) => {
    const query = `DELETE FROM tasks WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

exports.getAllTask = async (search, status) => {
    let query = `SELECT * FROM tasks WHERE 1=1`
    let values = [];
    let count = 1;

    if (search){
        query += ` AND title ILIKE $${count}`
        values.push(`%${search}%`);
        count++;
    }

    if (status){
        query += ` AND status = $${count}`
        values.push(status);
        count++;
    }

    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, values);
    return result.rows;
}

exports.getTaskById = async (id) => {
    const query = `SELECT * FROM tasks WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}