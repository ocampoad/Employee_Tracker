const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');
const connection = require('./db/connection');

const getTables = connection.query('SELECT * FROM department')
console.log(getTables);

