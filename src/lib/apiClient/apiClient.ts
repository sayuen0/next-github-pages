import axios, {AxiosInstance} from 'axios';
import {ImageBlobResponseType} from "./types";


class ApiClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error(`baseUrlが定義されていません`)
    }
    this.axios = axios.create({ baseURL: baseUrl })
  }

  async getCardImage(card: string): Promise<ImageBlobResponseType> {
    return this.axios.get(`/static/img/${card}.png`, { responseType: "blob" })
  }
}

export default class ApiClientFactory {
  private static client: ApiClient

  static create(): ApiClient {
    if (!this.client) {
      // TODO: config
      this.client = new ApiClient("https://deckofcardsapi.com/");
    }
    return this.client;
  }
};
