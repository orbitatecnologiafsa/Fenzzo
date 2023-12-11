const connection = require('./connections');

const getAll = async () => {
    const [rows] = await connection.query('SELECT * FROM PRODUTOS');
    return rows;
};

module.exports = getAll;