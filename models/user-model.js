const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: {
        first: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [2, 'Username must be at least 2 characters long'] 
        },
        middle: {
            type: String,
            trim: true,
        },
        last: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'] 
        }
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [4, 'Username must be at least 4 characters long and can be mixture of numbers and letters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Basic email format validation
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid phone number'], // Assumes 10 digit phone numbers
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [15, 'Age cannot be less than 15'],
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a full name virtual property
userSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.last}`;
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Pre-save middleware to ensure age matches date of birth
userSchema.pre('save', function (next) {
    const dob = new Date(this.dob);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (this.age !== calculatedAge) {
        return next(new Error('Age does not match the date of birth'));
    }
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
