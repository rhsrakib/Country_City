import { Component, OnInit } from '@angular/core';
import { CountryWithCities } from '../../models/country-with-cities';
import { CoutrycityService } from '../../services/coutrycity.service';
import { Router } from '@angular/router';
import { City } from '../../models/city';

@Component({
  selector: 'app-displaycountrycity',
  templateUrl: './displaycountrycity.component.html',
  styleUrl: './displaycountrycity.component.css'
})
export class DisplaycountrycityComponent implements OnInit {
  baseUrl='http://localhost:5121';
  imageUrl:string=this.baseUrl+'Images/'
  countryList: CountryWithCities[] = [];
   cityList: City[] = [];  
   constructor(private countryCityService: CoutrycityService, private router: Router) {}
 ngOnInit() {
   this.getAllCountriesWithCities();   
 }
 getAllCountriesWithCities() {
   this.countryCityService.getAllCountriesWithCities().subscribe(
     (data) => {
       this.countryList = data.map((item) => ({
         country: item.country,
         cities: item.cities,
       }));
     },
     (error) => {
       console.error('Error fetching countries and cities:', error);
     }
   );
 }  
 deleteCountryWithCities(countryId: number) {
   this.countryCityService.deleteCountryAndCities(countryId).subscribe({
     next: (response) => {
       let currentUrl = this.router.url;
       this.router
         .navigateByUrl('/', { skipLocationChange: true })
         .then(() => {
           this.router.navigate([currentUrl]);
         });
     }
   });
 }
}
