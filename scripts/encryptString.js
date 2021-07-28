if (process.argv.length !== 3) {
    console.log("String must be defined");
    process.exit();
}

const Verification = require("../verification-helper");

let encryptedString = Verification.encrypt(process.argv[2]);
console.log(encryptedString);

