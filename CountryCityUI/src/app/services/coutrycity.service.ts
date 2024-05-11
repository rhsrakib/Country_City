import { Injectable } from '@angular/core';
import { City } from '../models/city';
import { HttpClient } from '@angular/common/http';
import { CountryWithCities } from '../models/country-with-cities';
import { Country } from '../models/country';
import { Observable } from 'rxjs';
import { UploadResponse } from '../models/uploadResponse';

@Injectable({
  providedIn: 'root'
})
export class CoutrycityService {
  baseUrl: string = 'http://localhost:5121';
  private selectedCity: City | null = null;
  constructor(private http: HttpClient) { }
  addCountryAndCities(countryWithCities: CountryWithCities) {
    return this.http.post<any>(this.baseUrl + '/api/City/AddCountryAndCities', countryWithCities);
  }
  getAllCountriesWithCities() {
    return this.http.get<CountryWithCities[]>(this.baseUrl + '/api/City/GetAllCountriesWithCities');
  }
  deleteCountryAndCities(countryId: number) {
    return this.http.delete<any>(this.baseUrl + `/api/City/DeleteCountryAndCities/${countryId}`);
  }
  getCountry(countryId: number){
    return this.http.get<CountryWithCities>(this.baseUrl + `/api/City/GetCountryWithCitiesbyId/${countryId}`);
  }
  deleteCity(cityId: number) {
    return this.http.delete<any>(this.baseUrl + `/api/City/DeleteCity/${cityId}`);
  }
  setSelectedCity(city: City) {
    this.selectedCity = city;
  }
  getSelectedCity(): City | null {
    return this.selectedCity;
  }
  // Update method to send a Country object instead of CountryWithCities
  updateCountryAndCities(countryId: number,country: Country): Observable<CountryWithCities> {
    return this.http.put<CountryWithCities>(`${this.baseUrl}/api/City/PutCountryAndCities/${countryId}`, country);
  }
  uploadImage(id:number,f:File):Observable<UploadResponse>{
    const formData=new FormData();
    formData.append('file',f);
    return this.http.post<UploadResponse>(`${this.baseUrl}/api/City/Upload/${id}`,formData)
  }
}
