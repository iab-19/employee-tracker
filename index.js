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
                viewDepartment();
                break;
            case choices[1]:
                // View all roles
                break;
            case choices[2]:
                // View all employees
                break;
            case choices[3]:
                // Add a department
                addDepartment();
                break;
            case choices[4]:
                // Add a role
                break;
            case choices[5]:
                // Add an employee
                break;
            case choices[6]:
                // Update an employee
                updateEmployee();
                break;
        }
    // console.log(data)
    })

}

// a function that displays all departments in the database
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

// a function that displays all roles in the database
function viewRole() {
    const sql = 'SELECT * FROM role;';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error viewing role');
        } else {
            console.table(data);
            menu();
        }
    })
}

// a function that displays all employees in the database
function viewEmployee() {

}

// a function that prompts the user to add a department to the database
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
                // db.end();
            });
        });
}

// a function that prompts the user to add a role to the database
function addRole() {

}

// a function that prompts the user to add an employee to the database
function addEmployee() {

}

// a function that asks the user which employee role would they like to update
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
            // db.end();
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
