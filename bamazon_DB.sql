DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;
USE bamazon_DB;
CREATE TABLE products (
		item_id INTEGER (11) AUTO_INCREMENT NOT NULL,
		product_name VARCHAR (50),
        department_name VARCHAR (50),
        price INTEGER (11) NOT NULL,
        stock_quantity INTEGER (50),
		PRIMARY KEY (item_id)
        
        );
        

