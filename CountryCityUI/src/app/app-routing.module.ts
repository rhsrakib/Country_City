import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplaycountrycityComponent } from './component/displaycountrycity/displaycountrycity.component';
import { EditcountrycityComponent } from './component/editcountrycity/editcountrycity.component';
import { AddcountrycityComponent } from './component/addcountrycity/addcountrycity.component';

const routes: Routes = [
  {path:'displayCountry' , component:DisplaycountrycityComponent},
  {path:'country' , component:AddcountrycityComponent},
  {
    path: 'countrycity/edit/:id',
    component: EditcountrycityComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
