import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.css'] // Fix the property name from styleUrl to styleUrls
})
export class PokemonDetailsComponent implements OnInit, OnDestroy {
  private detailsSubscription: Subscription = new Subscription();
  pokemon: any;
  bool = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.detailsSubscription = this.pokemonService.details$.subscribe((pokemon: any) => {
      this.bool = true;
      console.log(pokemon);
      this.pokemon = pokemon;
    });
  }

  ngOnDestroy(): void {
    this.detailsSubscription.unsubscribe();
  }
}
