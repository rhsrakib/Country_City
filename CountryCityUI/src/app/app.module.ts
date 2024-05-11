import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddcountrycityComponent } from './component/addcountrycity/addcountrycity.component';
import { DisplaycountrycityComponent } from './component/displaycountrycity/displaycountrycity.component';
import { EditcountrycityComponent } from './component/editcountrycity/editcountrycity.component';

@NgModule({
  declarations: [
    AppComponent,
    AddcountrycityComponent,
    DisplaycountrycityComponent,
    EditcountrycityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,
    FormsModule,ReactiveFormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
