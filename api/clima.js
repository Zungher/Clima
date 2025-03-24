const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const lat = '14.6349';
    const lon = '-90.5069';

    // 1. Solicitar datos cada 2 horas (hourly_interval=2),
    //    incluyendo los parámetros que necesites en "hourly="
    const url = `https://api.open-meteo.com/v1/forecast
      ?latitude=${lat}
      &longitude=${lon}
      &current_weather=true
      &hourly=temperature_2m,weathercode,relativehumidity_2m,pressure_msl
      &hourly_interval=2
      &timezone=auto`;

    const { data } = await axios.get(url);

    // 2. Validar que tengamos datos
    if (!data || !data.current_weather || !data.hourly) {
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

    // 3. Datos del clima actual
    const currentWeather = data.current_weather;
    const condition = weatherDescriptions[currentWeather.weathercode] || 'Sin datos';

    // 4. Para humedad y presión del clima actual, buscar el índice de la hora actual en los arrays
    const currentTime = currentWeather.time;
    const hourlyIndex = data.hourly.time.indexOf(currentTime);

    let humidity = 'Sin datos';
    let pressure = 'Sin datos';

    if (hourlyIndex !== -1) {
      humidity = `${data.hourly.relativehumidity_2m[hourlyIndex]}%`;
      pressure = `${data.hourly.pressure_msl[hourlyIndex]} hPa`;
    }

    // 5. Si quieres enviar también un pronóstico para las próximas horas,
    //    construye un array con las horas (ya cada 2 horas)
    const forecastData = [];
    for (let i = 0; i < data.hourly.time.length; i++) {
      forecastData.push({
        time: data.hourly.time[i],
        temperature: data.hourly.temperature_2m[i],
        weathercode: data.hourly.weathercode[i],
        humidity: data.hourly.relativehumidity_2m[i],
        pressure: data.hourly.pressure_msl[i]
      });
    }

    // 6. Responder con toda la información
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      temperatura: `${currentWeather.temperature}°C`,
      estado: condition,
      viento: `${currentWeather.windspeed} km/h`,
      humedad: humidity,
      presion: pressure,
      forecast: forecastData
    });

  } catch (error) {
    console.error('ERROR:', error.message);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
};
