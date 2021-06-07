const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "record file sucessfull",
      result: results.rows,
    };

    if (results.rows.length > 0) {
      response.status(200).json(object);
    } else {
      object.responsemessage = "nodata found";
      object.responsecode = "400";
      response.status(200).json(object);
    }
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "record file sucessfull",
      result: results.rows,
    };

    if (results.rows.length > 0) {
      response.status(200).json(object);
    } else {
      object.responsemessage = "nodata found";
      object.responsecode = "400";
      response.status(200).json(object);
    }
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }

      pool.query(
        "Select * from users where id=(select max(id) from users)",
        (err, data) => {
          if (err) {
            throw err;
          }
          let object = {
            responsecode: "200",
            responsemessage: "reg sucessfull",
            result: data.rows,
          };
          if (data.rows.length > 0) {
            response.status(200).json(object);
          } else {
            object.responsemessage = "Database related error";
            object.responsecode = "400";
            response.status(200).json(object);
          }
        }
      );
    }
  );
};

const updateUser = (request, response) => {
  const { id, name, email } = request.body;
  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      pool.query(`Select * from users where id=${id}`, (err, data) => {
        if (err) {
          throw err;
        }
        let object = {
          responsecode: "200",
          responsemessage: "reg sucessfull",
          result: data.rows,
        };
        if (data.rows.length > 0) {
          response.status(200).json(object);
        } else {
          object.responsemessage = "Database related error";
          object.responsecode = "400";
          response.status(200).json(object);
        }
      });
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "record deleted sucessfully",
    };
    response.status(200).json(object);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
