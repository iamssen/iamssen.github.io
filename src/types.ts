import * as React from 'react';

export interface Content {
  title:string;
  path?:string;
  component?:React.ReactType;
  getComponent?:Function;
}