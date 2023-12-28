import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';
import { PokemonAbilitiesComponent } from './pokemon-abilities/pokemon-abilities.component';
import { RotatingImageComponent } from './rotating-image/rotating-image.component';

const routes: Routes = [
  { path: 'pokemon-details', component: PokemonDetailsComponent },
  { path: 'pokemon-abilities', component: PokemonAbilitiesComponent },
  { path: 'see-pokemon-3d', component: RotatingImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
