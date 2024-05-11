import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoutrycityService } from '../../services/coutrycity.service';
import { Country } from '../../models/country';
import { City } from '../../models/city';

@Component({
  selector: 'app-editcountrycity',
  templateUrl: './editcountrycity.component.html',
  styleUrl: './editcountrycity.component.css'
})
export class EditcountrycityComponent implements OnInit {
  url = '/assets/img/noimage.png';
  fileToUpload: any;
  picture: File = null!;
  constructor(private router: Router,
    private route: ActivatedRoute,private countryCityService: CoutrycityService){
  }
  countryObj:Country={ id:0,name:'',iso2:'',iso3:'',cities:[],picture:''}
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.countryCityService.getCountry(Number(id)).subscribe({            
            next: (res) => {  
              this.cityList=res.cities                        
              this.countryObj={
                id:res.country.id,
                name:res.country.name,
                iso2:res.country.iso2,
                iso3:res.country.iso3,
                cities:this.cityList,
                picture:res.country.picture
              }  
            },
          });
        }
      },
    });
  }
  countryList:Country[]=[];  
  cityList:City[]=[];  
  cityObj:City={ id:0,name:'',lot:'',lan:'',cid:0  }
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
    if (objWithTitle > -1) {
      arry.splice(objWithTitle, 1);
    }
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
  updateCountryAndCities() {
    console.log(this.countryObj.id)
    console.log(this.countryObj)
    this.countryCityService
      .updateCountryAndCities(this.countryObj.id, this.countryObj)
      .subscribe({
        next: (response) => {
          this.router.navigate(['displayCountry']);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
