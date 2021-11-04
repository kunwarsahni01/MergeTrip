// // jest-dom adds custom jest matchers for asserting on DOM nodes.
// // allows you to do things like:
// // expect(element).toHaveTextContent(/react/i)
// // learn more: https://github.com/testing-library/jest-dom
// import '@testing-library/jest-dom';

// const webdriver = require("selenium-webdriver");
// const driver = new webdriver.Builder().forBrowser("chrome").build();

// export function testing() {
//     // Instantiate a web browser page
//     const By = webdriver.By;

//     driver.navigate().to("http://localhost:3000/")
//         .then(() => driver.findElement(By.css("#login")))
//         .then(element => element.getAttribute("value"))
//         .then(value => console.log(value));
//     const until = webdriver.until;
//     driver.navigate().to("http://localhost:3000/")
//         .then(() => driver.findElement(By.css('#Account-input')).sendKeys('test@test.com'))
//         .then(() => driver.wait(until.elementLocated(By.css('#Account-input'))))
//         .then(() => driver.findElement(By.css('#.Account-button ')).click());
//     driver.navigate().to("http://localhost:3000/")
//         .then(() => driver.findElement(By.css('#Account-input')).sendKeys('123456'))
//         .then(() => driver.wait(until.elementLocated(By.css('#Account-input-password'))))
//         .then(() => driver.findElement(By.css('#.Account-button ')).click());
// }
