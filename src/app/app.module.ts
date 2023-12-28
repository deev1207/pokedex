import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RotatingImageComponent } from './rotating-image/rotating-image.component';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';
import { PokemonAbilitiesComponent } from './pokemon-abilities/pokemon-abilities.component';


@NgModule({
  declarations: [
    AppComponent,
    RotatingImageComponent,
    PokemonDetailsComponent,
    PokemonAbilitiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
