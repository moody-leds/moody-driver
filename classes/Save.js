'use strict';

const fs = require('fs');

module.exports = class Save {
    static save(content) {
        fs.writeFileSync('./save.settings', content); 
    }
    static load() {
        const content = fs.readFileSync('./save.settings'); 
    }
}