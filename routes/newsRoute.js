const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

router.get("/jobnews", newsController.jobNews);
router.get("/govtjobnews", newsController.govtJobNews);
router.get("/itjobnews", newsController.itJobNews);
router.get("/getlatestnews", newsController.getLatestNews);

module.exports = router; 
