DROP TABLE IF EXISTS passport;
-- DROP TABLE IF EXISTS document_type;

CREATE TABLE document_type (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE
);

INSERT INTO document_type (type_name) VALUES ('passport');

CREATE TABLE passport (
    id SERIAL PRIMARY KEY,
    document_type_id INTEGER REFERENCES document_type(id) ON DELETE CASCADE,
    machine_readable_zone TEXT,
    country_region VARCHAR(10),
    date_of_birth DATE,
    date_of_expiration DATE,
    document_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    nationality VARCHAR(50),
    sex VARCHAR(10),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
