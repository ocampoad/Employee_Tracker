const inquirer = require("inquirer");
const connection = require('./../db/connection')
// const LogTable = require("./objects");
// const logTable = new LogTable;

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ]).then(async answers => {
        let menuChoice = answers.menu;
        switch (menuChoice) {
            case 'View all departments':
                try {
                    let [result] = await connection.query(`SELECT * FROM department`);
                    console.table("", result)
                } catch (error) {
                    console.log(error);
                }
                break;
            case 'View all roles':
                try {
                    let [result] = await connection.query(`
                SELECT role.id, role.title, department.name AS department, role.salary
                FROM role
                LEFT JOIN department ON role.department_id = department.id;`)
                    console.table("", result)
                } catch (error) {
                    console.log(error);
                }
                break;
            case 'View all employees':
                try {
                    let [result] = await connection.query(`
                SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.salary, employee.manager_id AS manager
                FROM employee
                INNER JOIN role ON employee.role_id = role.id
                INNER JOIN department ON role.department_id = department.id
                ORDER BY employee.id;
                `)
                    console.table("", result)
                } catch (error) {
                    console.log(error);
                }
                break
            case 'Add a department':
                deptName = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'departmentName',
                        message: 'What is the name of the department?'
                    }
                ]).then(answers => {
                    return answers.departmentName;
                });
                deptName = deptName.trim();
                deptName = deptName[0].toUpperCase() + deptName.slice(1).toLowerCase();
                try {
                    await connection.query(`
                    INSERT INTO department (name)
                    VALUES ('${deptName}');
                `)
                } catch (error) {
                    console.log(error);
                }
                break
            case 'Add a role':
                console.log('5')
                break
            case 'Add an employee':
                console.log('6')
                break
            case 'Update an employee role':
                console.log('7');
                break
        };
        await mainMenu();
    })
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        }
    ]).then(answers => {
        return answers.departmentName;
    });
};



module.exports = mainMenu;