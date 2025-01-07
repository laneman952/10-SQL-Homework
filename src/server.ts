import { QueryResult } from 'pg';
import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';

const mainMenu = async () => {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'What would you like to do?',
      choices: [
        'view all departments',
        'view all roles',
        'view all employees',
        'add a department',
        'add a role',
        'add an employee',
        'update an employee role',
        'exit'
      ],
    },
  ]);

  switch (option) {
    case 'view all departments':
      await viewAllDepartments();
      break;
    case 'view all roles':
      await viewAllRoles();
      break;
    case 'view all employees':
      await viewAllEmployees();
      break;
    case 'add a department':
      await addDepartment();
      break;
    case 'add a role':
      await addRole();
      break;
    case 'add an employee':
      await addEmployee();
      break;
    case 'update an employee role':
      await updateEmployeeRole();
      break;
    case 'exit':
      console.log('Goodbye!');
      process.exit();
  }
};
mainMenu();

const viewAllDepartments = async() => {
  try {
  const query = 'SELECT * FROM department';
  const { rows }: QueryResult = await pool.query(query);
  console.table(rows);
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
  mainMenu();
};

const viewAllRoles = async() => {
  try {
const query = 'SELECT * FROM role';
const { rows }: QueryResult = await pool.query(query);
  console.table(rows);
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
  mainMenu();
};

const viewAllEmployees = async() => {
  try {
  const query = 'SELECT * FROM employee';
  const { rows }: QueryResult = await pool.query(query);
  console.table(rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
  mainMenu();
};

const addDepartment = async() => {
  try {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    },
  ]);

  const query = 'INSERT INTO department (name) VALUES ($1)';
  await pool.query(query, [departmentName]);
  console.log('Department added!');
} catch (error) {
  console.error('Error adding department:', error);
}
  mainMenu();
};

const addRole = async() => {
  try {
  const { title, salary, departmentId } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter the title of the role:', },
    {  type: 'number', name: 'salary', message: 'Enter the salary of the role:', },
    { type: 'number', name: 'departmentId', message: 'Enter the department ID of the role:', },
  ]);
  const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
  await pool.query(query, [title, salary, departmentId]);
  console.log('Role added!');
} catch (error) {
  console.error('Error adding role:', error);
}
mainMenu();
};


const addEmployee = async() => {
  try {
  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
   { type: 'input', name: 'firstName', message: 'Enter the first name of the employee:', },
   { type: 'input', name: 'lastName', message: 'Enter the last name of the employee:', },
   { type: 'number', name: 'roleId', message: 'Enter the role ID of the employee:', },
   { type: 'number', name: 'managerId', message: 'Enter the manager ID of the employee:', },
  ]);
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
  await pool.query(query, [firstName, lastName, roleId, managerId]);
  console.log('Employee added!');
} catch (error) {
  console.error('Error adding employee:', error);
}
mainMenu();
};

const updateEmployeeRole =async() => {
  try {
  const { employeeId, roleId } = await inquirer.prompt([
    { type: 'number', name: 'employeeId', message: 'Enter the ID of the employee:', },
    { type: 'number', name: 'roleId', message: 'Enter the new role ID of the employee:', },
  ]);
  const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
  await pool.query(query, [roleId, employeeId]);
  console.log('Employee role updated!');
} catch (error) {
  console.error('Error updating employee role:', error);
}
mainMenu();
};

await connectToDb();
