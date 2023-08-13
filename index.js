const inquirer = require('inquirer'); // allow use of inquirer
const mysql = require('mysql2');

const choices = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee'
];


inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do',
            name: 'choice',
            choices: [choices[0], choices[1], choices[2], choices[3], choices[4], choices[5], choices[6]],
        },
    ])
    .then((data) => {
        let print;
        switch (data.choice){
            case choices[0]:
                // View all departments
                print = 'You chose 1';
                break;
            case choices[1]:
                // View all roles
                print = 'You chose 2';
                break;
            case choices[2]:
                // View all employees
                print = 'You chose 3';
                break;
            case choices[3]:
                // Add a department
                print = 'You chose 4';
                break;
            case choices[4]:
                // Add a role
                print = 'You chose 5';
                break;
            case choices[5]:
                // Add an employee
                print = 'You chose 6';
                break;
            case choices[6]:
                // Update an employee
                print = 'You chose 7';
                break;
        }
    // return print;
        console.log(print);
    // console.log(data)
    })


// when 'view all departments' is selected
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name of the department',
                name: 'deparmentName',
            }
        ])
        .then((data) => {
`INSERT INTO department (name)
VALUES (${data.departmentName});`;

        })
}
