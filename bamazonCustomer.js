var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');
var fs = require('fs');


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
	
})

console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('');
console.log('|--------------------------------------------------------------------------------|');
console.log('');
console.log('|-------------------------- B   A   M   A   Z   O   N ---------------------------|');
console.log('');
console.log('|--------------------------------------------------------------------------------|');

// created the start function
var start = function () {

    connection.query('SELECT * FROM products', function (err, result) {
        if (err) console.log(err);

        var table = new Table({
            head: ['Item Id', 'Product Name', 'Deparment', '$ Price', 'Quantity'],
            style:
            {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < result.length; i++) {
            table.push([result[i].item_id, result[i].product_name, result[i].department_name, result[i].price.toFixed(2), result[i].stock_quantity]);
        }
        console.log(table.toString());
        purchase();
    })
}

// created function to grab products from database table
var purchase = function () {

    connection.query('SELECT * FROM products', function (err, result) {

        if (err) console.log(err);

        inquirer.prompt([{
            name: "itemID",
            type: "list",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < result.length; i++) {
                    choiceArray.push([result[i].item_id].toString());
                }
                return choiceArray;
            },
            message: "What item would you like to purchase?  Choose by <Item ID>"
        }, {
            name: "quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
          // function to calculate stock remaining  
        }]).then(function (answer) {
            var itemID = answer.itemID - 1
            var chosenProduct = result[itemID]
            var chosenQuantity = answer.quantity
            if (chosenQuantity <= result[itemID].stock_quantity) {
                console.log("Your total for " + "(" + answer.quantity + ")" + " - " + result[itemID].product_name + " is: $" + result[itemID].price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: result[itemID].stock_quantity - chosenQuantity
                }, {
                    item_id: result[itemID].item_id
                }], function (err, result) {

                    start();
                });

            } else {
                console.log("Insufficient Quantity! Maximum of " + result[itemID].stock_quantity + " available.");
                start();
            }
        })

    }
    )
};


start();