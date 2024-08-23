const dbgr = require("debug")("development:jobwallah/newsController");

module.exports = {
    jobNews: async (req, res, next) => {
        try {
            
        } catch (error) {
            dbgr("Error fetching news:", error);
            next(error)
        }
    },

    govtJobNews: async (req, res, next) => {
        try {
            
        } catch (error) {
            dbgr("Error fetching news:", error);
            next(error)
        }
    },

    itJobNews: async (req, res, next) => {
        try {
            
        } catch (error) {
            dbgr("Error fetching news:", error);
            next(error)
        }
    },

    getLatestNews: async (req, res, next) => {
        try {
            let response = await fetch("https://newsapi.org/v2/top-headlines?country=in&apiKey=afd6e6f8c11f4e45aacfb634e2ec0142");
            let data = await response.json();
            res.json(data);
        } catch (error) {
            dbgr("Error fetching news:", error);
            next(error)
        }
    }
}