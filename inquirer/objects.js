const connection = require('./../db/connection')

class LogTable {
    // logDepartmentTable() {
    //     const id = connection.query(`SELECT * FROM department`)
    //     return id
    // };

    async logDepartmentTable() {
        try {
            let [result] = await connection.query(`SELECT * FROM department`); 
            console.table("", result)
        } catch (error) {
            console.log(error);
        }
    }

    logRolesTable() {
        connection.query(`
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id;`, (err, res, fields) => {
            console.table('', res, );
        });
    }
}

module.exports = LogTable; 

// , (err, res, fields) => {
//     console.table('', res)
// });
// try {
//     var sql= "SELECT count(*) AS hitung FROM information_schema.columns WHERE table_name = 'table' ";
//     let result = await connection.query(sql); 
//     result.map(val => {
//         console.log(val);
//     });
// }
// catch(exception) {
//     console.log(exception)
// }