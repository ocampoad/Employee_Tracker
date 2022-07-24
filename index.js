const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');
const connection = require('./db/connection');
const mainMenu = require('./inquirer/mainMenu')

mainMenu();


