const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const url = 'https://weather.com/weather/today/l/GTXX0002:1:GT';

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);

    // Scrape de temperatura y estado
    const temp = $('.CurrentConditions--tempValue--3KcTQ').first().text().trim();
    const condition = $('.CurrentConditions--phraseValue--2xXSr').first().text().trim();

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