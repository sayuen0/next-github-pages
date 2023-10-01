export type AxiosCommonResponse<T> = {
  data: T;
  status: number;
  statusText: string;
  headers: any; // 必要に応じて詳細な型を定義することもできます
  config: any; // 必要に応じて詳細な型を定義することもできます
  request?: any; // 必要に応じて詳細な型を定義することもできます
};

export type ImageBlobResponseType = AxiosCommonResponse<Blob>;
