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
                console.log(deptName)
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
                const [arrayOfCurrentDept] = await connection.query(
                    `SELECT name FROM department`
                );
                let someArray = ['N/A']
                await arrayOfCurrentDept.forEach( element => someArray.push(element.name));
                [roleName, salary, department] = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'roleName',
                        message: 'What is the name of the role?'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of this role?'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: someArray
                    }
                ]).then(answers => {
                    return [answers.roleName, answers.salary, answers.department]
                });
                salary = salary.trim();
                roleName = roleName[0].toUpperCase() + roleName.slice(1).toLowerCase();
                try {
                    const deptIdresult = await connection.query(`
                    SELECT id FROM department WHERE name = '${department}'; 
                    `);
                    let deptId = deptIdresult[0][0].id
                    await connection.query(`
                    INSERT INTO role (title, salary, department_id)
                    VALUES ('${roleName}', '${salary}','${deptId}');
                `)
                } catch (error) {
                    console.log(error);
                }
                break
            case 'Add an employee':
                [firstName, lastName, role, manager] = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name?"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is employee's role?",
                        choices: roleArrays
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managerArrays
                    }
                ]).then(answers => {
                    return [answers.firstName, answers.lastName, answers.role, answers.manager]
                });
                salary = salary.trim();
                roleName = roleName[0].toUpperCase() + roleName.slice(1).toLowerCase();
                try {
                    const deptIdresult = await connection.query(`
                    SELECT id FROM department WHERE name = '${department}'; 
                    `);
                    let deptId = deptIdresult[0][0].id
                    await connection.query(`
                    INSERT INTO role (title, salary, department_id)
                    VALUES ('${roleName}', '${salary}','${deptId}');
                `)
                } catch (error) {
                    console.log(error);
                }
                break
                break
            case 'Update an employee role':
                console.log('7');
                break
        };
        await mainMenu();
    })
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which departmetn does the role belong to?',
            choices: [
                'Engineering',
                'Finance',
                'Legal',
                'Sales'
            ]
        }

    ]).then(answers => {
        return [answers.roleName, answers.salary, answers.department]
    });
};



module.exports = mainMenu;