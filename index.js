const inquirer = require('inquirer'); // allow use of inquirer

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
                print = 'You chose 1';
                break;
            case choices[1]:
                print = 'You chose 2';
                break;
            case choices[2]:
                print = 'You chose 3';
                break;
            case choices[3]:
                print = 'You chose 4';
                break;
            case choices[4]:
                print = 'You chose 5';
                break;
            case choices[5]:
                print = 'You chose 6';
                break;
            case choices[6]:
                print = 'You chose 7';
                break;
        }
    // return print;
        console.log(print);
    // console.log(data)
    })
