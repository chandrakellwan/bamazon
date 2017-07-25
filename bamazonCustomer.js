var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// create connection to database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
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


function start() {

	connection.query("SELECT 'item_id', 'product_name', 'department_name', 'price', 'stock_quantity' FROM products", function(err, res) {

		if (err) throw err;

		console.table(res);

		inquirer.prompt([{
			name: "item",
			type: "input",
			message: "Which item_id do you want to order?",
			validate: function(value) {

				for (var i=0; i<res.length; i++) {
						if (value == res[i].item_id) {

								return true;
						}
				}

				return "Enter a valid item_id number";
			}

	}, {

			name: "quantity",
			type: "input",
			message: "How many do you want to order?",
			validate: function(value) {

					if (isNaN(value) == false && parseInt(value) >= 1 && value == parseInt(value)) {

							return true;

					} 

					else {

							return "Please enter a number greater that 0";

					}
			}

		}]).then(function(answer) {

				order(answer.item_id, answer.stock_quantity);

		})
	})

}