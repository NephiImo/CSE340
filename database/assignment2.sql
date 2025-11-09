-- Data for table 'account'
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
	)
VALUES	(
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Update account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony Stark record from database
DELETE FROM account
WHERE account_id = 1;

-- Update "GM Hummer" record from "small interior" to "a huge interior"
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- SELECT make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category
SELECT 
	inventory.inv_make,
	inventory.inv_model,
	classification.classification_name
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE 
	classification.classification_name = 'Sport';

-- Update "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');