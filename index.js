const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["token"];
  console.log("token", typeof token);
  // Status: Unauthorised
  if (!token)
    return res.json({
      responsemessage: "please provide token",
      responsecode: "401",
    });

  if (token != "subho")
    return res.json({
      responsemessage: "invalid token",
      responsecode: "401",
    });

  if (token == "subho") {
    next();
  }
};

app.get("/getUsers/", authenticateToken, db.getUsers);

app.get("/getUsersById/:id", db.getUserById);

app.post("/createUser/", db.createUser);

app.put("/updateUser/", db.updateUser);

app.delete("/deleteUser/:id", db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
