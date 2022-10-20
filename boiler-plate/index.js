const express = require("express");
const app = express();
const port = 5000;
const config = require("./config/key");
const { User } = require("./models/User");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connect..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("npm run backend! nodemon! 서버다시안켜도된다");
});

app.post("/register", (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면 DB에 넣어준다
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
