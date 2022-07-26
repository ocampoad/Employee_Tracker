const inquirer = require("inquirer");
const connection = require('./../db/connection')
require('console.table');

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
                    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                    FROM employee 
                    LEFT JOIN role on employee.role_id = role.id 
                    LEFT JOIN department on role.department_id = department.id 
                    LEFT JOIN employee manager on manager.id = employee.manager_id;
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
                const [arrayOfCurrentDept] = await connection.query(
                    `SELECT name FROM department`
                );
                let deptArray = []
                await arrayOfCurrentDept.forEach(element => deptArray.push(element.name));
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
                        choices: deptArray
                    }
                ]).then(answers => {
                    return [answers.roleName, answers.salary, answers.department]
                });
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
                const [arrayOfCurrentRoles] = await connection.query(
                    `SELECT title FROM role`
                );
                const [arrayOfCurrentManagers] = await connection.query(
                    `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`
                );
                let rolesArray = [];
                await arrayOfCurrentRoles.forEach(element => rolesArray.push(element.title));
                let managerArray = ['N/A']
                await arrayOfCurrentManagers.forEach(element => managerArray.push(element.first_name + ' ' + element.last_name));
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
                        choices: rolesArray
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managerArray
                    }
                ]).then(answers => {
                    return [answers.firstName, answers.lastName, answers.role, answers.manager]
                });
                try {
                    const roleIdresult = await connection.query(`
                    SELECT id FROM role WHERE title = '${role}'; 
                    `);
                    let roleId = roleIdresult[0][0].id
                    if (manager === 'N/A') {
                        await connection.query(`
                        INSERT INTO employee (first_name, last_name, role_id)
                        VALUES ('${firstName}', '${lastName}','${roleId}');
                        `)
                    } else {
                        const managerIdresult = await connection.query(`
                        SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) = '${manager}';`);
                        let managerId = managerIdresult[0][0].id;
                        await connection.query(`
                        INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES ('${firstName}', '${lastName}','${roleId}', ${managerId});
                        `)
                    }
                } catch (error) {
                    console.log(error);
                }
                break
            case 'Update an employee role':
                const [arrayOfCurrentEmployees] = await connection.query(
                    `SELECT first_name, last_name FROM employee `
                );
                const [arrayOfRoles] = await connection.query(
                    `SELECT title FROM role `
                )
                let employeesArray = [];
                await arrayOfCurrentEmployees.forEach(element => employeesArray.push(element.first_name + ' ' + element.last_name));
                let anotherRolesArray = [];
                await arrayOfRoles.forEach(element => anotherRolesArray.push(element.title));
                [employeeName, role] = await inquirer.prompt([
                    {
                        type: 'list',
                        name: "employeeName",
                        message: "Which employee's role do you want to update?",
                        choices: employeesArray
                    },
                    {
                        type: 'list',
                        name: "role",
                        message: "Which role do you want to assignt the selected employee?",
                        choices: anotherRolesArray
                    }
                ]).then(answers => {
                    return [answers.employeeName, answers.role]
                });
                try {
                    const roleIdresult = await connection.query(`
                    SELECT id FROM role WHERE title = '${role}'; 
                    `);
                    let roleId = roleIdresult[0][0].id
                    let employeeFirstName = employeeName.trim().split(' ')[0];
                    console.log(employeeFirstName)
                    await connection.query(
                        `UPDATE employee SET role_id = ${roleId} WHERE first_name = '${employeeFirstName}' `
                    );
                } catch (error) {
                    console.log(error);
                }
                break
        };
        await mainMenu();
    })
};

module.exports = mainMenu;