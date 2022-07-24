const inquirer = require("inquirer");
const Department = require("./objects")
let department;


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
    ]).then(answers => {
        let menuChoice = answers.menu;
        switch (menuChoice) {
        case 'View all departments':
            department = new Department;
            department.viewDepartment();
            mainMenu()
            break
        case 'View all roles':
            console.log('2');
            mainMenu()
            break
        case 'View all employees':
            console.log('3');
            mainMenu()
            break
        case 'Add a department':
            console.log('4');
            mainMenu()
            break
        case 'Add a role':
            console.log('5');
            mainMenu()
            break
        case 'Add an employee':
            console.log('6');
            mainMenu()
            break
        case 'Update an employee role':
            console.log('7');
            mainMenu()
            break
        }
    })
};

module.exports = mainMenu;