const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const lat = '14.6349';
    const lon = '-90.5069';

    // Se agregan parámetros para obtener humedad, presión y ajustar la zona horaria a Guatemala
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,pressure_msl&timezone=America/Guatemala`;

    const { data } = await axios.get(url);

    const weather = data?.current_weather;
    if (!weather) {
      throw new Error('No se pudo obtener el clima');
    }

    // Mapeo de códigos de clima a descripciones
    const weatherDescriptions = {
      0:  "Despejado",
      1:  "Principalmente despejado",
      2:  "Parcialmente nublado",
      3:  "Nublado",
      45: "Niebla",
      48: "Niebla con escarcha",
      51: "Llovizna ligera",
      53: "Llovizna moderada",
      55: "Llovizna densa",
      61: "Lluvia ligera",
      63: "Lluvia moderada",
      65: "Lluvia intensa",
      80: "Chubascos ligeros",
      81: "Chubascos moderados",
      82: "Chubascos violentos"
    };

    const condition = weatherDescriptions[weather.weathercode] || 'Sin datos';

    // Hora actual reportada por la API (ya en la zona horaria de Guatemala)
    const currentTime = weather.time;
    // Convertir a objeto Date
    const dateTime = new Date(currentTime);
    const hour = dateTime.getHours();

    // Determinar momento del día (ajusta los rangos si lo deseas)
    let momento = '';
    if (hour >= 0 && hour < 6) {
      momento = 'Madrugada';
    } else if (hour >= 6 && hour < 18) {
      momento = 'Día';
    } else {
      momento = 'Noche';
    }

    // Buscar el índice de la hora actual en el array de tiempos horarios
    const hourlyIndex = data.hourly.time.indexOf(currentTime);

    let humidity = 'Sin datos';
    let pressure = 'Sin datos';

    if (hourlyIndex !== -1) {
      humidity = `${data.hourly.relativehumidity_2m[hourlyIndex]}%`;
      pressure = `${data.hourly.pressure_msl[hourlyIndex]} hPa`;
    }

    // Respuesta
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      temperatura: `${weather.temperature}°C`,
      estado: condition,
      viento: `${weather.windspeed} km/h`,
      humedad: humidity,
      presion: pressure,
      momento // Ejemplo: 'Madrugada', 'Día' o 'Noche'
    });

  } catch (error) {
    console.error('ERROR:', error.message);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
};
