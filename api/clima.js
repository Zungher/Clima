const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const lat = '14.6349';
    const lon = '-90.5069';

    // URL en una sola línea
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode,relativehumidity_2m,pressure_msl&current_weather=true&hourly_interval=2&timezone=auto`;

    console.log('URL:', url); // Para verificar la URL en consola

    const { data } = await axios.get(url);

    if (!data || !data.current_weather || !data.hourly) {
      throw new Error('No se pudo obtener el clima');
    }

    // Mapeo de códigos
    const weatherDescriptions = {
      0: "Despejado",
      1: "Principalmente despejado",
      2: "Parcialmente nublado",
      3: "Nublado",
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

    // Clima actual
    const currentWeather = data.current_weather;
    const condition = weatherDescriptions[currentWeather.weathercode] || 'Sin datos';

    // Humedad y presión actuales
    const currentTime = currentWeather.time;
    const hourlyIndex = data.hourly.time.indexOf(currentTime);

    let humidity = 'Sin datos';
    let pressure = 'Sin datos';

    if (hourlyIndex !== -1) {
      humidity = `${data.hourly.relativehumidity_2m[hourlyIndex]}%`;
      pressure = `${data.hourly.pressure_msl[hourlyIndex]} hPa`;
    }

    // Pronóstico (cada 2 horas)
    const forecastData = data.hourly.time.map((time, i) => ({
      time,
      temperature: data.hourly.temperature_2m[i],
      weathercode: data.hourly.weathercode[i]
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      temperatura: `${currentWeather.temperature}°C`,
      estado: condition,
      viento: `${currentWeather.windspeed} km/h`,
      humedad,
      presion: pressure,
      forecast: forecastData
    });

  } catch (error) {
    // Aquí verás el mensaje de error real
    console.error('ERROR:', error.message);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
};
