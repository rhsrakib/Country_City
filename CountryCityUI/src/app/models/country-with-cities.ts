import { City } from "./city";
import { Country } from "./country";
export interface CountryWithCities {
    country: Country;
    cities: City[];
}
