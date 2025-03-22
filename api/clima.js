const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const url = 'https://www.meteored.com.gt/tiempo-en_Ciudad+de+Guatemala-America+Central-Guatemala-GUATEMALA-6353/';

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);

    const temp = $('.datos-actuales .dato-temperatura').first().text().trim();
    const condition = $('.datos-actuales .txt-estado').first().text().trim();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      temperatura: temp,
      estado: condition
    });

  } catch (error) {
    console.error('ERROR:', error.message);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
};