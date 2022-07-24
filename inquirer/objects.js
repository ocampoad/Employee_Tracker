function logTable(tablename) {
    connection.query(`SELECT * FROM ${tablename}`,(err, res, fields) => {
        try {
            console.table(res)
        } catch (err) {
            console.error(err)
        }
    });
}

// class Department {
//     constructor(id, name) {
//         this.id = id;
//         this.name = name;
//         this.table = 'department'
//     }
//     viewDepartment() {
//         logTable(this.table)
//     }
// };

module.exports = logTable(); 