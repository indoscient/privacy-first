declare module 'cors' {
  import { RequestHandler } from 'express';
  interface CorsOptions {
    origin?: boolean | string | RegExp | string[];
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    // add any other options you need …
  }
  function cors(options?: CorsOptions): RequestHandler;
  export = cors;
}
