import axios from 'axios';

const server_endPoint = import.meta.env.VITE_SERVER_ENDPOINT;
const server_port = import.meta.env.VITE_SERVER_PORT;

const instance = axios.create({
  baseURL: `${server_endPoint}:${server_port}/`,
});
instance.defaults.headers.post['Accept'] = 'application/json';
instance.defaults.withCredentials = true;

export default instance;
