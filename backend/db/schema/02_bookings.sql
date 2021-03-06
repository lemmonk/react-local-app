DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY NOT NULL,
  host_key VARCHAR(255) DEFAULT NULL,
  host_name VARCHAR(255) DEFAULT NULL,
  host_email VARCHAR(255) DEFAULT NULL,
  host_city VARCHAR(255) DEFAULT NULL,
  user_key VARCHAR(255) DEFAULT NULL,
  user_name VARCHAR(255) DEFAULT NULL,
  user_email VARCHAR(255) DEFAULT NULL,
  user_city VARCHAR(255) DEFAULT NULL,
  title VARCHAR(255) DEFAULT NULL,
  status VARCHAR(255) DEFAULT NULL,
  price VARCHAR(255) DEFAULT NULL,
  color VARCHAR(255) DEFAULT NULL,
  start_time VARCHAR(255) DEFAULT NULL,
  end_time VARCHAR(255) DEFAULT NULL,
  host_rate_ref VARCHAR(255) DEFAULT NULL,
  user_rate_ref VARCHAR(255) DEFAULT NULL,
  stamp DATE DEFAULT NOW()
);
