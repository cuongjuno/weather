import axios from 'axios';
import { DOMAIN_SERVER, API_KEY } from '../utils/config';

export async function getWeatherByCityName(cityName) {
  return await axios
    .get(`http://${DOMAIN_SERVER}`, {
      params: {
        q: cityName,
        appid: API_KEY,
      },
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));
}
