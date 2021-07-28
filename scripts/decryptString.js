
if (process.argv.length !== 3) {
    console.log("String must be defined");
    process.exit();
}

const Verification = require("../verification-helper");

let decryptedString = Verification.decrypt(process.argv[2]);
console.log(decryptedString);
