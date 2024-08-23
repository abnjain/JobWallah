const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbgr = require("debug")("development:jobwallah")
require("dotenv").config();
require("./config/dbConfig");
const PORT = process.env.PORT || 3000;

const userRoute = require("./routes/userRoute");
const newsRoute = require("./routes/newsRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: "JeeeeBoiiiiii",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get("/", ( req, res ) => {
    res.send("Hello World!");
});

app.use("/users", userRoute);
app.use("/news", newsRoute);


app.listen(PORT, () => {
    dbgr(`Server is running on port ${PORT}`);
});