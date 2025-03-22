const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const url = 'https://www.timeanddate.com/weather/guatemala/guatemala-city';

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Obtenemos la temperatura y descripción
    const temp = $('.h2').first().text().trim();
    const condition = $('.bk-focus__info').find('p').first().text().trim();

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