const inquirer = require('inquirer'); // Allow use of inquirer
const mysql = require('mysql2'); // Allow use of mysql2
require('dotenv').config(); // Use dotenv to protect credentials

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

    },
    console.log('Connected to the employees_db database.')
);

// Options to be displayed by inquirer
const choices = [
    'View all departments',
    'Add a department',
    'View all roles',
    'Add a role',
    'View all employees',
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
                // Add a department
                addDepartment();
                break;
            case choices[2]:
                // View all roles
                viewRole();
                break;
            case choices[3]:
                // Add a role
                addRole();
                break;
            case choices[4]:
                // View all employees
                viewEmployee();
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
    })

}

// A function that displays all departments in the database
// and returns to the main menu when finished
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

// A function that displays all roles in the database
// and returns to the main menu when finished
function viewRole() {
    const sql = 'SELECT role.title AS job_title, role.id AS role_id, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id;';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error viewing role', err);
        } else {
            console.table(data);
            menu();
        }
    })
}

// A function that displays all employees in the database
// and returns to the main menu when finished
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

// A function that prompts the user to add a department to the database
// and returns to the main menu when finished
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
            // Add to the department table with the user data collected by inquirer
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

// A function that prompts the user to add a role to the database
// and returns to the main menu when finished
function addRole() {
    // Select all rows from the department table, map the data
    // into an object and use those objects as choices for the inquirer prompt
    const sql ='SELECT * FROM department';
    db.query(sql, (err, results) => {
        const departments = results.map(department => {
            return {name:department.name, value:department.id}
        });
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
                type: 'list',
                message: 'Choose the department this role belongs to:',
                name: 'department',
                choices: departments,
            }
        ])
        .then((data) => {
            console.log(data);
            // Add to the role table with the user data collected by inquirer
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
    })
}

// A function that prompts the user to add an employee to the database
// and returns to the main menu when finished
function addEmployee() {
    // Select all rows from the role table, map the data
    // into an object and use those objects as choices for the inquirer prompt
    const sql ='SELECT * FROM role';
    db.query(sql, (err, results) => {
        const roles = results.map(role => {
            return {name:role.title, value:role.id}
        });
    // Select all rows from the employee table, map the data
    // into an object and use those objects as choices for the inquirer prompt
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
        // Add to the employee table with the user data collected by inquirer
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

// A function that asks the user which employee role would they like to update
// and returns to the main menu when finished
function updateEmployee() {
    // Select all rows from the employee table, map the data
    // into an object and use those objects as choices for the inquirer prompt
    const sql ='SELECT * FROM employee';
    db.query(sql, (err, results) => {
        const employees = results.map(employee => {
            return {name:employee.first_name+' '+employee.last_name, value:employee.id}
        });

    // Select all rows from the role table, map the data
    // into an object and use those objects as choices for the inquirer prompt
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
        // Update the employee table with the user data collected by inquirer
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

// Display the menu upon starup
menu();
