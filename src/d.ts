declare module 'jsonp' {
  export interface Options {
    param?:string;
    timeout?:number;
    prefix?:string;
    name?:string;
  }

  export default function (url:string, opts:Options, callback:(error:Error, data:any) => void);
}