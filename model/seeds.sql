USE tracker_db; 

INSERT INTO department (name)
VALUES ('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('John', 'Doe', 1 ),
('Mike', 'Chan', 2),
('Ashley', 'Rodriguez', 3),
('Kevin', 'Tupik', 4),
('Kunal', 'Singh', 5),
('Malia', 'Brown', 6),
('Sarah', 'Lourd', 7),
('Tom', 'Allen', 8);

UPDATE employee
SET manager_id = 1
WHERE first_name = 'Mike';

UPDATE employee
SET manager_id = 3
WHERE first_name = 'Kevin';

UPDATE employee
SET manager_id = 5
WHERE first_name = 'Malia';

UPDATE employee
SET manager_id = 7
WHERE first_name = 'Tom';