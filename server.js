const express = require('express'),
path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');
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

        res.json({ title, author ,publisher});
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});


const port = 3001;
// Configuring port for APP
app.listen(port, () => console.log(`Listening on port ${port}`))

