const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const lat = '14.6349';
    const lon = '-90.5069';
    const url = `https://weather.com/api/v1/p/redux-dal/getSunV3CurrentObservationsUrlConfig?geocode=${lat}%2C${lon}&language=es-GT&format=json`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
      }
    });

    const observation = data?.dal?.getSunV3CurrentObservationsUrlConfig?.data?.v3observations?.location?.observation[0];

    const temp = observation?.temperature ?? 'N/A';
    const condition = observation?.wxPhraseLong ?? 'N/A';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      temperatura: `${temp}°C`,
      estado: condition
    });

  } catch (error) {
    console.error('ERROR:', error.message);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
};