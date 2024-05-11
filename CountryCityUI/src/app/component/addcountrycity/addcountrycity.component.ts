import { Component } from '@angular/core';
import { CoutrycityService } from '../../services/coutrycity.service';
import { Router } from '@angular/router';
import { Country } from '../../models/country';
import { City } from '../../models/city';
import { CountryWithCities } from '../../models/country-with-cities';

@Component({
  selector: 'app-addcountrycity',
  templateUrl: './addcountrycity.component.html',
  styleUrl: './addcountrycity.component.css'
})
export class AddcountrycityComponent {
  constructor(private countryCityService: CoutrycityService,private router:Router){}
  url = '/assets/img/noimage.png';
  fileToUpload: any;
  picture: File = null!;
  countryList:Country[]=[];
  countryObj:Country={ id:0,name:'',iso2:'',iso3:'',cities:[],picture:''}
  cityList:City[]=[];  
  cityObj:City={id:0,name:'',lot:'',lan:'',cid:0 }
  addCities(){
    if (this.cityObj.name !== '' && this.cityObj.lot !== '' && this.cityObj.lan !== '') {
      const strExpObj = JSON.stringify(this.cityObj);
      const obj = JSON.parse(strExpObj);
      this.cityList.unshift(obj);
      this.cityObj = {
        id:0,name:'',lot:'',lan:'',cid:0
      };
    }
  }
  deletecity(exp: City, arry: any[]) {
    const objWithTitle = arry.findIndex((obj) => obj.name == exp.name);
    if (objWithTitle > -1) {  arry.splice(objWithTitle, 1);  }
  }
  onFileSelected(event: any) {
    this.fileToUpload = event?.target?.files[0];
    let fileType = event.target.files[0].type;
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.picture = event.target.files[0];
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };      
    } 
    else { window.alert('Please select correct image format'); }
    this.picture = event.target.files[0];
  }
  upload(id:number){
  const reader=new FileReader();
  reader.onload=(ev:any)=>{
    this.countryCityService.uploadImage(id, this.picture).subscribe({
      next:r=>{
        console.log(r)
      }
    })
  }
  }
  addCountryAndCities() {
    // Prepare the object to be sent to the server
    const countryWithCities: CountryWithCities = {
      country: this.countryObj,
      cities: this.cityList
    };    
    // Make the HTTP POST request using the service
    this.countryCityService.addCountryAndCities(countryWithCities).subscribe(
      (response) => {
        // Success: Handle the response if needed
        console.log('Country and Cities added successfully:', response);
        // Optionally, you can reset the form or clear the cityList array after successful submission
        this.countryObj = {
          id: 0,     name: '',   iso2: '',  iso3: '',   cities: [],
          picture:''
        };
        this.cityList = [];
        this.router.navigate(['displayCountry'])
      },
      (error) => {
        // Error: Handle the error if needed
        console.error('Error adding Country and Cities:', error);
      }
    );
  }
}
