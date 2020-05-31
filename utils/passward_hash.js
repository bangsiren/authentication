const crypto = require('crypto');
const express = require('express');
const app = express()
exports.getHashPassward = (passward)=>{
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(passward).digest('base64');
    return hash;
};
