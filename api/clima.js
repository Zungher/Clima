const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const url = 'https://www.meteored.com.gt/tiempo-en_Ciudad+de+Guatemala-America+Central-Guatemala-GUATEMALA-6353/';

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Busca el valor de temperatura y estado
    const temp = $('.datos-actuales .dato-temperatura').first().text().trim();
    const condition = $('.datos-actuales .txt-estado').first().text().trim();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      temperatura: temp,
      estado: condition
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
};
