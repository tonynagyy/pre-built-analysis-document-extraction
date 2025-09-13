const pool = require("../db");

const savePassport = async (passportData) => {
  const {
    machine_readable_zone,
    country_region,
    date_of_birth,
    date_of_expiration,
    document_number,
    first_name,
    last_name,
    nationality,
    sex,
  } = passportData;

  const result = await pool.query(
    `INSERT INTO passport 
      (document_type_id, machine_readable_zone, country_region, date_of_birth, date_of_expiration, 
       document_number, first_name, last_name, nationality, sex)
     VALUES (
       (SELECT id FROM document_type WHERE type_name = 'passport'),
       $1, $2, $3, $4, $5, $6, $7, $8, $9
     )
     RETURNING *`,
    [
      machine_readable_zone,
      country_region,
      date_of_birth,
      date_of_expiration,
      document_number,
      first_name,
      last_name,
      nationality,
      sex,
    ]
  );

  return result.rows[0];
};

module.exports = { savePassport };
