import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-abilities',
  templateUrl: './pokemon-abilities.component.html',
  styleUrls: ['./pokemon-abilities.component.css'] 
})
export class PokemonAbilitiesComponent implements OnInit, OnDestroy {
  private abilitiesSubscription: Subscription = new Subscription();
  abilities: any = '';
  stats: any = '';
  bool = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.abilitiesSubscription = this.pokemonService.abilities$.subscribe((data: any) => {
      this.bool = true;
      this.abilities = data.abilities;
      this.stats = data.base_stats;
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    this.abilitiesSubscription.unsubscribe();
  }
}
