"use strict";
const forge = require("node-forge");
const {privateKey} = require("./config");
const rsa = forge.pki.rsa;

class Verification {
  constructor() {
    let value;
    try {
      value = forge.pki.privateKeyFromPem(privateKey);
    } catch (e) {
      throw new Error("wrong privateKey");
    }
    this.privateKey = value;
    this.publicKey = rsa.setPublicKey(value.n, value.e);
  }

  encrypt(password) {
    let kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
    let kem = forge.kem.rsa.create(kdf1);
    let result = kem.encrypt(this.publicKey, 16);

    let iv = forge.random.getBytesSync(12);
    let cipher = forge.cipher.createCipher("AES-GCM", result.key);
    cipher.start({ iv: iv });
    // cipher.update(forge.util.createBuffer(password, 'utf8'));
    let passwordEncodedUtf8 = forge.util.encodeUtf8(password);
    cipher.update(forge.util.createBuffer(passwordEncodedUtf8));
    cipher.finish();
    let encrypted = cipher.output.getBytes();
    let tag = cipher.mode.tag.getBytes();

    // return {
    //   encapsulation: forge.util.bytesToHex(result.encapsulation),
    //   iv: forge.util.bytesToHex(iv),
    //   tag: forge.util.bytesToHex(tag),
    //   codeHash: forge.util.bytesToHex(encrypted)
    // };
    return `${forge.util.bytesToHex(result.encapsulation)}_${forge.util.bytesToHex(iv)}_${forge.util.bytesToHex(tag)}_${forge.util.bytesToHex(encrypted)}`;
  }

  parseEncryptedString(encryptedString) {
    let keys = encryptedString.split('_');
    return {
        encapsulation: keys[0],
        iv: keys[1],
        tag: keys[2],
        codeHash: keys[3]
    }
  }

  decrypt(encryptedString) {
    let config = this.parseEncryptedString(encryptedString);
    let encapsulation = forge.util.hexToBytes(config.encapsulation);
    let iv = forge.util.hexToBytes(config.iv);
    let tag = forge.util.hexToBytes(config.tag);
    let encrypted = forge.util.hexToBytes(config.codeHash);

    let kdf1 = new forge.kem.kdf1(forge.md.sha1.create());
    let kem = forge.kem.rsa.create(kdf1);
    let key = kem.decrypt(this.privateKey, encapsulation, 16);

    let decipher = forge.cipher.createDecipher("AES-GCM", key);
    decipher.start({ iv: iv, tag: tag });
    decipher.update(forge.util.createBuffer(encrypted));
    let pass = decipher.finish();
    if (pass) {
      let result = decipher.output.getBytes();
      result = forge.util.decodeUtf8(result);
      return result;
    }
  }
}

let verification = new Verification();
module.exports = verification;
