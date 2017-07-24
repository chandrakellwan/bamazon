var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// create connection to database
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "bamazon_DB"
});

// verify connection to the database
connection.connect(function(err) {

	if (err) {
		// if there is a connection error, log it and throw an error
		console.log("Database connection failed");
		throw err;
	}
	
	// call the start function
	start();
})
