-- Insert 20 Users
INSERT INTO users (user_id, email, name, google_id) VALUES
(1, 'alice.johnson@example.com', 'Alice Johnson', 'google_1001'),
(2, 'bob.smith@example.com', 'Bob Smith', 'google_1002'),
(3, 'carol.white@example.com', 'Carol White', 'google_1003'),
(4, 'david.brown@example.com', 'David Brown', 'google_1004'),
(5, 'emma.wilson@example.com', 'Emma Wilson', 'google_1005'),
(6, 'frank.miller@example.com', 'Frank Miller', 'google_1006'),
(7, 'grace.davis@example.com', 'Grace Davis', 'google_1007'),
(8, 'henry.garcia@example.com', 'Henry Garcia', 'google_1008'),
(9, 'iris.martinez@example.com', 'Iris Martinez', 'google_1009'),
(10, 'jack.rodriguez@example.com', 'Jack Rodriguez', 'google_1010'),
(11, 'kate.lopez@example.com', 'Kate Lopez', 'google_1011'),
(12, 'leo.gonzalez@example.com', 'Leo Gonzalez', 'google_1012'),
(13, 'maria.hernandez@example.com', 'Maria Hernandez', 'google_1013'),
(14, 'nathan.moore@example.com', 'Nathan Moore', 'google_1014'),
(15, 'olivia.taylor@example.com', 'Olivia Taylor', 'google_1015'),
(16, 'peter.anderson@example.com', 'Peter Anderson', 'google_1016'),
(17, 'quinn.thomas@example.com', 'Quinn Thomas', 'google_1017'),
(18, 'rachel.jackson@example.com', 'Rachel Jackson', 'google_1018'),
(19, 'sam.lee@example.com', 'Sam Lee', 'google_1019'),
(20, 'tina.walker@example.com', 'Tina Walker', 'google_1020');

-- Insert 12 Stores
INSERT INTO stores (store_id, store_name, store_url) VALUES
(1, 'TechGear Pro', 'https://techgearpro.example.com'),
(2, 'Fashion Forward', 'https://fashionforward.example.com'),
(3, 'Home Essentials', 'https://homeessentials.example.com'),
(4, 'Sports Central', 'https://sportscentral.example.com'),
(5, 'Book Haven', 'https://bookhaven.example.com'),
(6, 'Pet Paradise', 'https://petparadise.example.com'),
(7, 'Garden Delight', 'https://gardendelight.example.com'),
(8, 'Toy World', 'https://toyworld.example.com'),
(9, 'Beauty Bliss', 'https://beautybliss.example.com'),
(10, 'Office Supply Hub', 'https://officesupplyhub.example.com'),
(11, 'Outdoor Adventure', 'https://outdooradventure.example.com'),
(12, 'Gourmet Foods', 'https://gourmetfoods.example.com');

-- User-Store Access Mapping (users can access multiple stores)
-- Alice manages stores 1, 2, 3
INSERT INTO user_store_access (user_id, store_id, access_level) VALUES
(1, 1, 'admin'), (1, 2, 'admin'), (1, 3, 'admin'),
-- Bob manages stores 4, 5
(2, 4, 'admin'), (2, 5, 'admin'),
-- Carol manages store 6
(3, 6, 'admin'),
-- David views stores 1, 7
(4, 1, 'viewer'), (4, 7, 'admin'),
-- Emma manages stores 8, 9
(5, 8, 'admin'), (5, 9, 'admin'),
-- Frank manages store 10
(6, 10, 'admin'),
-- Grace manages stores 11, 12
(7, 11, 'admin'), (7, 12, 'admin'),
-- Henry views stores 2, 3, 4
(8, 2, 'viewer'), (8, 3, 'viewer'), (8, 4, 'viewer'),
-- Iris views store 5
(9, 5, 'viewer'),
-- Jack manages store 1 (co-admin with Alice)
(10, 1, 'admin'),
-- Kate views stores 6, 7, 8
(11, 6, 'viewer'), (11, 7, 'viewer'), (11, 8, 'viewer'),
-- Leo views stores 9, 10
(12, 9, 'viewer'), (12, 10, 'viewer'),
-- Maria manages store 2 (co-admin)
(13, 2, 'admin'),
-- Nathan views stores 11, 12
(14, 11, 'viewer'), (14, 12, 'viewer'),
-- Olivia views all stores (superuser)
(15, 1, 'viewer'), (15, 2, 'viewer'), (15, 3, 'viewer'), (15, 4, 'viewer'),
(15, 5, 'viewer'), (15, 6, 'viewer'), (15, 7, 'viewer'), (15, 8, 'viewer'),
(15, 9, 'viewer'), (15, 10, 'viewer'), (15, 11, 'viewer'), (15, 12, 'viewer'),
-- Peter manages store 3 (co-admin)
(16, 3, 'admin'),
-- Quinn views store 4
(17, 4, 'viewer'),
-- Rachel views stores 5, 6
(18, 5, 'viewer'), (18, 6, 'viewer'),
-- Sam views stores 7, 8, 9
(19, 7, 'viewer'), (19, 8, 'viewer'), (19, 9, 'viewer'),
-- Tina views stores 10, 11, 12
(20, 10, 'viewer'), (20, 11, 'viewer'), (20, 12, 'viewer');
