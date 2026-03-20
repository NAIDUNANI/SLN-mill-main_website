
-- Delete "normally rice" and "Paddy" products
DELETE FROM products WHERE id IN ('28c6bba2-9d90-4396-8591-fa307b2e3b14', '023a377f-6460-4eee-8cf5-028db558e299');

-- Update Raw rice with new image and description
UPDATE products SET 
  image_url = '/products/raw-rice',
  description = 'Pure unpolished raw rice sourced directly from our paddy fields. Rich in fiber and natural nutrients, this wholesome rice retains its authentic taste and is perfect for traditional South Indian meals.',
  price = 950
WHERE id = 'c1d4f5e0-08ef-4f8b-adfb-ab0547218dfd';

-- Update prices for other products (800-1000 range)
UPDATE products SET price = 850 WHERE id = '90a5da88-eabf-4fe8-9618-aba2379215ce'; -- BBT Steam Rice
UPDATE products SET price = 900 WHERE id = '17ac3b09-4b36-4446-87e4-285fa73c9438'; -- HMT Steam Rice
UPDATE products SET price = 820 WHERE id = '08f331ff-4417-4323-911c-5138f28802d7'; -- BBT Raw Rice
UPDATE products SET price = 980 WHERE id = '4fe16171-ee66-43ee-bd60-8b5fda571c4c'; -- Sona Masoori Rice
UPDATE products SET price = 860 WHERE id = 'a9fd7062-c22f-4e69-9f84-5aa201de0b3b'; -- Ponni Boiled Rice
UPDATE products SET price = 1000 WHERE id = 'f835ea48-0436-4844-8d17-68462ac31e07'; -- Golden Sella Basmati
UPDATE products SET price = 800 WHERE id = '463af6e3-2cf3-4db8-b7c7-27af62172ef9'; -- Idli Rice
UPDATE products SET price = 880 WHERE id = '064e6165-59fb-4f43-a677-c19b37854a42'; -- HMT Raw Rice
