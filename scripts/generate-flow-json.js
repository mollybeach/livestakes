require('dotenv').config();
const fs = require('fs');

const flowJson = {
    accounts: {
        "my-account": {
            address: process.env.PUBLIC_ADDRESS,
            key: process.env.PRIVATE_KEY
        }
    },
    // ...rest of your config
};

fs.writeFileSync('flow.json', JSON.stringify(flowJson, null, 2));