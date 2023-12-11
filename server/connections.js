const mysql2 = require('mysql2/promise');


    const connection = mysql2.createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "fenzzoteste",
        port: 3306
    });
    
module.exports = connection