const puppeteer = require('puppeteer')
const fs = require('fs/promises')

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://learnwebcode.github.io/practice-requests",)
    // await page.screenshot({ path: "test.png", fullPage: true })
    const names = await page.evaluate(() => {
        // return document.querySelectorAll(".info strong")    //returns object
        // return [...document.querySelectorAll(".info strong")].map(el => el.textContent)
        return Array.from(document.querySelectorAll(".info strong")).map(el => el.textContent)
        //object to array
    })
    console.log(names)
    await fs.writeFile("names.txt", names.join('\n'))

    const images = await page.$$eval("img", (images) => {   //$$eval used for getting array
        return images.map(img => img.src)
    })
    console.log(images)

    await page.click("#clickme")
    const text = await page.$eval("#data", el => el.textContent)
    console.log(text)

    await page.pdf({ path: 'hn.pdf', format: 'a4' });

    await page.type("#ourfield", "blue ")
    await page.click("#ourform button")
    await page.waitForNavigation()

    const info = await page.$eval("#message", el => el.textContent)
    console.log(info)

    for (photo of images) {
        const imagePage = await page.goto(photo)    //page in the current tab changes
        await fs.writeFile(photo.split('/').pop(), await imagePage.buffer())
    }

    await browser.close()
}

start()