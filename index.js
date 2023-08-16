const inquirer = require('inquirer'); // allow use of inquirer
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'exceptionTidy!23',
        database: 'employee_db'
        // process.env.DB_USER,
        // process.env.DB_PASSWORD,
        // process.env.DB_NAME

    },
    console.log('Connected to the employees_db database.')
);

const choices = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee'
];

function menu () {
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
                viewDepartment();
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
                addDepartment();
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
                updateEmployee();
                break;
        }
    // return print;
        console.log(print);
    // console.log(data)
    })

}


function viewDepartment() {
    const sql = 'SELECT * FROM department;';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error viewing department');
        } else {
            console.table(data);
            menu();
        }
    })
}

function viewRole() {

}

function viewEmployee() {

}

// when 'view all departments' is selected
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name of the department',
                name: 'departmentName',
            }
        ])
        .then((data) => {
            console.log(data);
            const sql ='INSERT INTO department (name) VALUES (?)';
            db.query(sql, [data.departmentName], (err, results) => {
                if (err) {
                    console.error('Error adding department:', err);
                } else {
                    console.log('Department added');
                    menu();
                }
                db.end();
            });
        });
}

function addRole() {

}

function addEmployee() {

}

function updateEmployee() {
    const sql ='SELECT * FROM role';
    db.query(sql, (err, results) => {
        const roles = results.map(role => {
            return {name:role.title, value:role.id}
        });
    const sql ='SELECT * FROM employee';
    db.query(sql, (err, results) => {
        const employees = results.map(employee => {
            return {name:employee.first_name+' '+employee.last_name, value:employee.id}
        });
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'employee',
            choices: employees,
        },
        {
            type: 'list',
            message: 'Select new role of the employee',
            name: 'employeeRole',
            choices: roles,
        }
    ])
    .then((data) => {
        console.log(data);
        const sql ='UPDATE employee SET role_id=? WHERE id=?';
        db.query(sql, [data.employeeRole, data.employee], (err, results) => {
            if (err) {
                console.error('Error updating employee:', err);
            } else {
                console.log('Employee updated');
                menu();
            }
            db.end();
        });
    });
})
})
}

menu();
// Runs schema.sql upon startup to initialize the databases
// function init() {
//     connection.query(

//     )
// }
