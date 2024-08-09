const User = require("../models/users");

async function checkToken(obj, arr, res) {
  User.findOne({ token: obj[arr] }).then((user) => {
    if (user === null || user === undefined) {
      res.status(401);
      res.json({ result: false, error: "Token invalide" });
      return;
    }

    obj = { ...obj, _id: user._id };
    console.log(obj);

    return obj;
  });
}

module.exports = { checkToken };

