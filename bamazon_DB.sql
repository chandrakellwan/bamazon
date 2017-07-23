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
        
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (101, "Buy Out Riddim", "Music Records", 20.00, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (102, "Aussie Hair Gel", "Health and Beauty", 7.00, 20);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (103, "Guns and Roses T-Shirt", "Apparel", 25.00, 5);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (104, "Apple TV 4th Generation", "Electronics", 150.00, 3);

select * from products;