INSERT INTO department (name) VALUES ('Management');

INSERT INTO role (title, salary, department_id) VALUES ('Manager', 500, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Nikola', 'Tesla', 1, NULL);
