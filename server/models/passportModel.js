const pool = require("../db");

const savePassport = async (passportData) => {
  const {
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
    `INSERT INTO passports 
      (document_type_id, country_region, date_of_birth, date_of_expiration, 
       document_number, first_name, last_name, nationality, sex)
     VALUES (
       (SELECT id FROM document_types WHERE type_name = 'passport'),
       $1, $2, $3, $4, $5, $6, $7, $8
     )
     RETURNING *`,
    [
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
