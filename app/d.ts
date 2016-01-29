declare function ga(send:string, preview:string, path?:string);

declare interface WaypointOptions {
  element:Element;
  handler:()=>void;
  offset?:number|string;
}

declare class Waypoint {
  constructor(options:WaypointOptions);
  destroy();
}