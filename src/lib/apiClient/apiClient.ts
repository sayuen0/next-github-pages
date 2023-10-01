import axios, { AxiosInstance } from 'axios';
import { ImageBlobResponseType } from './types';

class ApiClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error(`baseUrlが定義されていません`);
    }
    this.axios = axios.create({ baseURL: baseUrl });
    this.axios.interceptors.request.use((req) => {
      console.log('Starting Request', JSON.stringify(req, null, 2));
      return req;
    });
    this.axios.interceptors.response.use((res) => {
      console.log('Response', JSON.stringify(res), null, 2);
      return res;
    });
  }

  async getCardImage(card: string): Promise<ImageBlobResponseType> {
    return this.axios.get(`/static/img/${card}.png`, { responseType: 'blob' });
  }
}

export default class ApiClientFactory {
  private static client: ApiClient;

  static create(): ApiClient {
    if (!this.client) {
      // TODO: config
      this.client = new ApiClient('https://deckofcardsapi.com/');
    }
    return this.client;
  }
}
