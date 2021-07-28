#### Install depedencies
        
        npm install
        
#### Generate privateKey

        const forge = require("node-forge");
        const rsa = forge.pki.rsa;
        let keyPair = rsa.generateKeyPair(24);
        let privateKey = keyPair.privateKey;
        let generatedPrivateKey = forge.pki.privateKeyToPem(privateKey);

generatedPrivateKey will have value for example
```
'-----BEGIN RSA PRIVATE KEY-----\r\n' +
'MCcCAQACBADXMw8CAwEAAQIDA4qJAgIO7QICDmsCAgs5AgIM3QICBds=\r\n' +
'-----END RSA PRIVATE KEY-----\r\n'
```

#### Encryption
```
cd scripts
node encryptString.js "Nam, 31, Vĩnh Phúc"
1a4f8d_659a5af70d1b14d30351d6ad_0522d3a87d9ab45f87dc8099ad4932a5_456b82c0152efe80138f3fad1a4fff5587b8f9e7
```

#### Decryption
```
cd scripts
node decryptString.js 1a4f8d_659a5af70d1b14d30351d6ad_0522d3a87d9ab45f87dc8099ad4932a5_456b82c0152efe80138f3fad1a4fff5587b8f9e7
Nam, 31, Vĩnh Phúc
```
