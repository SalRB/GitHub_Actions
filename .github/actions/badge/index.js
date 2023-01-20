const fs = require("fs");
const path = require('path');

const readme = path.resolve('./README.md')

const res = process.env.cypress_outcome;

let URL;

if (res == "failure") {
    URL = "https://img.shields.io/badge/test-failure-red";
} else if (res == "success") {
    URL = "https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg";
}

URL = "<!-- Start -->\n![BADGE](" + URL + ")\n<!-- End -->"
console.log("ejecutandose el index");

fs.writeFile(readme, URL, function (err) {
    if (err) throw err;
    console.log('Archivo actualizado.');
})