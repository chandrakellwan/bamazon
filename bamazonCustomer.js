var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


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

})

console.log('');
console.log('');
console.log('');
console.log('|------------------------------------------------------------------------------------------------|');
console.log('');
console.log('|----------------------------------- B   A   M   A   Z   O   N ----------------------------------|');
console.log('');
console.log('|------------------------------------------------------------------------------------------------|');

var prod_arr = []; // Array to hold products info

// Function show products info
function productPurchase() {

    // Get from database and create table with products info
    connection.query('SELECT * FROM products', function(err, res) {

        if(err) {
            console.log('Error select: ' + err);
            return;
        }

        //create table: head and column size
        var table = new Table({
            head: ['ID', 'PRODUCT NAME', 'DEPARTMENT NAME', '$ PRICE', 'QUANTY'],
            colWidths: [10, 35, 25, 12, 10]
        });

        prod_arr.length = 0; // Clear array before add the values again

        for(var i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,res[i].department_name,res[i].price.toFixed(2),res[i].stock_quantity]); // Add elements to table
            prod_arr.push([res[i].item_id,res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity,res[i].product_sales]); // Add elements to array
        }
        console.log(table.toString()); // Show table
        console.log('');

        selectProduct(); // Call Function select products
    });
}

// Function select products to purchase
function selectProduct() {

    // Asks the ID and quantity
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Item_ID of the product you would like to order:",
            name: "product_id"
        }, {
            type: "input",
            message: "How many would you like to order?",
            name: "quantity"
        }
    ]).then(function(a) {
        var id = parseInt(a.product_id); // Get product ID and turn it into an int
        var desired_qty = parseInt(a.stock_quantity); // Get the quantity and turn it into an int

        // If product's ID does not exists, call function again
        if(id < 1 || id >= prod_arr.length) {
            console.log('');
            console.log('Product not found, please try again!');
            console.log('');
            selectProduct();
        }

        var stock_qty = prod_arr[id-1][4]; // Get stock quantity from array

        // If quantoty greater than stock, call function again
        if(desired_qty > stock_qty) {
            console.log('');
            console.log('Insufficient quantity!');
            console.log('Please select again:');
            console.log('');
            selectProduct();
        } else {

            var new_quantity = stock_qty - desired_qty; // Get the new stock value to update the database
            var cost = parseFloat(prod_arr[id-1][5]) + (desired_qty * parseFloat(prod_arr[id-1][3])); // Get the value to update the database
            var spent = (desired_qty * parseFloat(prod_arr[id-1][3])).toFixed(2); // Calculates the value spent by the user

            // Updates the database with new values
            connection.query('UPDATE products SET ? WHERE ?', [
                {stock_quantity: new_quantity, product_sales: cost.toFixed(2)},
                {item_id: id}
            ], function(err, res) {
                if(err) {
                    console.log('Error update: ' + err);
                    return;
                }

                console.log('');
                console.log('You purchased ' + desired_qty + ' ' + prod_arr[id-1][1] + '(s)');
                console.log('You spent U$' + spent + ' dollar(s)');
            });

            // Get department to update it's total sales
            connnection.query('SELECT department_id, total_sales FROM departments WHERE department_name = ?', [prod_arr[id-1][2]], function(err, res) {
                if(err) {
                    console.log('Error select: ' + err);
                    return;
                }

                var total = parseFloat(res[0].total_sales) + (desired_qty * parseFloat(prod_arr[id-1][3]));

                // Update total sales of the department
                connection.query('UPDATE departments SET ? WHERE ?', [
                    {total_sales: total.toFixed(2)},
                    {department_id: res[0].department_id}
                ], function(err, res) {
                    if(err) {
                        console.log('Error update: ' + err);
                        return;
                    }

                    console.log('');
                    console.log('');

                    // Asks if user wants to buy more products
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Do you want to buy another product?",
                            choices: ["Yes", "No (Exit)"],
                            name: "option"
                        }
                    ]).then(function(a) {
                        if(a.option == "Yes") {
                            productPurchase(); // If yes, call function again
                        } else {
                            connection.end(function(err) {}); // If no, ends the application
                        }
                    });
                });
            });
        }
    });
}

productPurchase(); // First Function called