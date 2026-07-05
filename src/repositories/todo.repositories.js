const { pool} = require('../config/database.js');

exports.createTask = async (title, description, status) => {
    const query = `INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [title, description, status]);
    return result.rows[0];
}