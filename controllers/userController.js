// controllers/userController.js
const bcrypt = require("bcrypt");
const dbgr = require("debug")("development:jobwallah/userController");
const User = require("../models/user-model");

module.exports = {
    register: async (req, res, next) => {
        const { username, password, email, name, phoneNumber, age, dob } = req.body;

        try {
            // Validate required fields
            if (!name || !name.first || !name.last) {
                return res.status(400).send("Name fields are required");
            }
            // Check if the username or email already exists
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).send("Username or email already in use, Try Different One!!");
            }

            // Create a new user instance
            const newUser = new User({
                username,
                password,
                email,
                name,
                phoneNumber,
                age,
                dob
            });

            // Save the user to the database
            await newUser.save();
            dbgr("New user registered:", newUser.username);
            res.status(201).send("User registered successfully");
        } catch (error) {
            dbgr("Error during registration:", error);
            res.status(500).send("An error occurred while registering the user");
            next(error);
        }
    },

    login: async (req, res, next) => {
        const { username, password } = req.body;

        try {
            // Find the user by username
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send("Invalid username or password");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send("Invalid username or password");
            }

            // Set session and cookie
            req.session.username = user.username;
            res.cookie("username", user.username, { maxAge: 900000, httpOnly: true });
            res.status(200).send("Login successful");
        } catch (error) {
            dbgr("Error during login:", error);
            res.status(500).send("An error occurred during login");
            next(error);
        }
    },

    getProfile: async (req, res, next) => {
        if (!req.session.username) {
            return res.status(401).send("Unauthorized: Please login to access this page");
        }

        try {
            // Find the user by username from the session
            const user = await User.findOne({ username: req.session.username });
            if (!user) {
                return res.status(404).send("User not found");
            }

            res.status(200).json({
                username: user.username,
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                age: user.age,
                dob: user.dob,
            });
        } catch (error) {
            dbgr("Error fetching profile:", error);
            res.status(500).send("An error occurred while fetching the profile");
            next(error);
        }
    },

    logout: (req, res) => {
        if (req.session.username) {
            // Destroy session and clear the cookie
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send("An error occurred during logout");
                }
                res.clearCookie("username");
                res.status(200).send("Logout successful");
            });
        } else {
            res.status(400).send("You are not logged in");
        }
    }
}
