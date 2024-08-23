const bcrypt = require("bcrypt");

async function compare() {
    const testPassword = 'password123';

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hash = await bcrypt.hash(testPassword, salt);
        console.log(hash, testPassword);
        

        // Compare the password with the hash
        const isMatch = await bcrypt.compare(testPassword, hash);

        console.log(`Password Match: ${isMatch}`); // Should log true
    } catch (error) {
        console.error("Error:", error);
    }
}

compare();
