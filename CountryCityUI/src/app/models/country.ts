import { City } from "./city";
export interface Country {
    id:number,
    name:string,
    iso2:string,
    iso3:string,
    picture:string
    cities:City[]
}
