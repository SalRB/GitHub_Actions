const fs = require("fs");
const path = require('path');

const readme = path.resolve('./README.md')

const res = process.env.res;

let URL;

const bad = "https://img.shields.io/badge/test-failure-red"
const good = "https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg"

if (res == "failure") {
    URL = bad;
} else if (res == "success") {
    URL = good;
}

fs.readFile(readme, 'utf8', function (err, data) {
    if (err) throw err;
    let updatedReadme = data.search(good) !== -1 ? data.replace(good, URL) : data.replace(bad, URL)
    fs.writeFile(readme, updatedReadme, function (err) {
        if (err) throw err;
        console.log('Archivo actualizado.');
    })
});
