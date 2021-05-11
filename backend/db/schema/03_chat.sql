DROP TABLE IF EXISTS chat CASCADE;

CREATE TABLE chat (
  id SERIAL PRIMARY KEY NOT NULL,
  host_key VARCHAR(255) DEFAULT NULL,
  user_key VARCHAR(255) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  message VARCHAR(255) DEFAULT NULL,
  stamp DATE DEFAULT NOW()
);