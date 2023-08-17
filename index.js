const inquirer = require('inquirer'); // allow use of inquirer
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        // user: 'root',
        // password: 'exceptionTidy!23',
        // database: 'employee_db'
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

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
                viewRole();
                break;
            case choices[2]:
                // View all employees
                viewEmployee();
                break;
            case choices[3]:
                // Add a department
                addDepartment();
                break;
            case choices[4]:
                // Add a role
                addRole();
                break;
            case choices[5]:
                // Add an employee
                addEmployee();
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
            console.error('Error viewing role', err);
        } else {
            console.table(data);
            menu();
        }
    })
}

// a function that displays all employees in the database
function viewEmployee() {
    const sql = 'SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, employee.manager_id AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error viewing employee', err);
        } else {
            console.table(data);
            menu();
        }
    })
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
            });
        });
}

// a function that prompts the user to add a role to the database
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name of the role you would like to add:',
                name: 'roleName',
            },
            {
                type: 'input',
                message: 'Enter the salary of the role:',
                name: 'salary',
            },
            {
                type: 'input',
                message: 'Choose the department id this role belongs to:',
                name: 'department',
            }
        ])
        .then((data) => {
            console.log(data);
            const sql ='INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);';
            db.query(sql, [data.roleName, data.salary, data.department], (err, results) => {
                if (err) {
                    console.error('Error adding role:', err);
                } else {
                    console.log('Role added');
                    menu();
                }
            });
        });
}

// a function that prompts the user to add an employee to the database
function addEmployee() {
    const sql ='SELECT * FROM role';
    db.query(sql, (err, results) => {
        const roles = results.map(role => {
            return {name:role.title, value:role.id}
        });
    const sql ='SELECT * FROM employee';
    db.query(sql, (err, results) => {
        const managers = results.map(employee => {
            return {name:employee.first_name+' '+employee.last_name, value:employee.id}
        });
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'Enter the first name the employee you would like to add:',
            name: 'firstName',
        },
        {
            type: 'input',
            message: 'Enter the last name the employee you would like to add:',
            name: 'lastName',
        },
        {
            type: 'list',
            message: 'Choose the role of this employee:',
            name: 'role',
            choices: roles,
        },
        // ?Does this employee have a manager
        {
            type: 'confirm',
            message: "Does this employee have a manager",
            name: 'hasManager',
        },
        {
            type: 'list',
            message: "Who is this employee's manager:",
            name: 'manager',
            choices: managers,
            default: 'null',
            when: (data) => data.hasManager == true,
        }
    ])
    .then((data) => {
        console.log(data);
        const sql ='INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
        db.query(sql, [data.firstName, data.lastName, data.role, data.manager], (err, results) => {
            if (err) {
                console.error('Error adding employee:', err);
            } else {
                console.log('Employee added');
                menu();
            }
        });
    });
})
})
}

// a function that asks the user which employee role would they like to update
function updateEmployee() {
    const sql ='SELECT * FROM employee';
    db.query(sql, (err, results) => {
        const employees = results.map(employee => {
            return {name:employee.first_name+' '+employee.last_name, value:employee.id}
        });
    const sql ='SELECT * FROM role';
    db.query(sql, (err, results) => {
        const roles = results.map(role => {
            return {name:role.title, value:role.id}
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
        });
    });
})
})
}

// Displays the menu upon starup
menu();
