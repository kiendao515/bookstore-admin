const express = require('express'),
    path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer')
app = express();

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.get('/api/book-info/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const url = `https://opac.nlv.gov.vn/pages/opac/wpid-search-stype-form-quick-sfield-isbn-keyword-${isbn}.html`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Lấy dữ liệu cần thiết
        const title = $('#ulSearchResult > li > div.media-body > h4 > a').text().trim();
        const author = $('#divBibInfo727468 > dd:nth-child(1) > a').text().trim();
        const publisher = $('/html/body/div[4]/div/div/div[2]/ul/li/div[3]/div/div[1]/dl/dd[2]/text()').text().trim();

        res.json({ title, author, publisher });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/book/:isbn', async (req, res) => {
    const { isbn } = req.params;
    const url = `https://opac.nlv.gov.vn/pages/opac/wpid-search-stype-form-quick-sfield-isbn-keyword-${isbn}.html`;

    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const buttons = await page.$$('.btn.btn-default'); // Thay bằng class thực tế của button
        for (const button of buttons) {
            const buttonText = await page.evaluate(el => el.textContent, button);
            if (buttonText.includes('Xem chi tiết')) {
                await button.click();
                break; 
            }
        }

        await page.waitForSelector('div.media-body > dl > dd:nth-child(2) > dl > dd:nth-child(2) > a');

        // Lấy dữ liệu từ trang sau khi đã tải đầy đủ
        const result = await page.evaluate(() => {
            const title = document.querySelector('#ulSearchResult > li > div.media-body > h4 > a')?.innerText.trim();
            const author = document.querySelector('div.media-body > dl > dd:nth-child(2) > dl > dd:nth-child(2) > a')?.innerText.trim();
            let publisher = document.querySelector('div.media-body > dl > dd:nth-child(3) > dl > dd:nth-child(2)')?.innerText.trim();
            const description = document.querySelector('div.media-body > dl > dd:nth-child(5) > dl > dd:nth-child(2)')?.innerText.trim();
            const tags = document.querySelector('div.media-body > dl > dd:nth-child(6) > dl > dd:nth-child(2)')?.innerText.trim()
            const yearRegex = /\b\d{4}\b$/;
            const yearMatch = publisher.match(yearRegex);
            const publisherRegex = /; (.*?), \d{4}$/;
            const pageRegex = /(\d+)\s*tr/;
            let year = '';
            let pages;
            const publisherMatch = publisher.match(publisherRegex);
            if (publisherMatch) {
                publisher = publisherMatch[1].trim();
            }
            if (yearMatch) {
                year = yearMatch[0];
                publisher = publisher.replace(/^H\.:.*?; /, '').replace(yearRegex, '').trim().replace(/[,;]$/, '');
            }
            const pageMatch = description.match(pageRegex);
            if (pageMatch) {
                pages = pageMatch[1];
            }
            return { title, author, publisher: publisher, publish_year: year, page: pages, tags };
        });

        // Đóng trình duyệt
        await browser.close();

        // Gửi dữ liệu dưới dạng JSON
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data' });
    }
})


const port = 3001;
// Configuring port for APP
app.listen(port, () => console.log(`Listening on port ${port}`))

