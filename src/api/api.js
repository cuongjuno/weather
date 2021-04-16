import axios from 'axios';
import { DOMAIN_SERVER, API_KEY } from '../utils/config';

export async function getOneCallDailyByCityName(query) {
  return await axios
    .get(`http://${DOMAIN_SERVER}/onecall`, {
      params: {
        lat: query.lat,
        lon: query.lon,
        exclude: 'current,minutely,hourly,alerts',
        appid: API_KEY,
      },
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));
}
