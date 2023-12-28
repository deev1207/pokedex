import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService } from './pokemon.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Pokemon } from './pokemon.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  pokemonSubscription: Subscription = new Subscription();
  habitatSubscription: Subscription = new Subscription();
  pokemon: Pokemon = {} as Pokemon;
  habitat: any = '';
  loading = false;
  error = '';
  searchTerm = '';
  evolves_to = '';
  baby = '';
  loaded = false;
  isHomePage = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });
  }

  getPokemonData(idOrName: string) {
    this.loading = true;

    this.pokemonSubscription = this.pokemonService.getPokemonAbility(idOrName).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.loading = false;
        this.loaded = true;
      },
      error: (error) => this.handleError(error)
    });

    this.habitatSubscription = this.pokemonService.getHabitat(idOrName).subscribe({
      next: (habitat) => {
        this.habitat = habitat['habitat'];
        this.evolves_to = habitat['evolves_to'];
        this.baby = habitat['baby'];
        console.log(this.evolves_to);
        this.loading = false;
      },
      error: (error) => this.handleError(error)
    });
  }

  searchPokemon() {
    this.router.navigate(['/pokemon-details']);

    if (this.searchTerm.trim() !== '') {
      this.getPokemonData(this.searchTerm.toLowerCase());
    }
  }

  ngOnDestroy() {
    this.pokemonSubscription.unsubscribe();
    this.habitatSubscription.unsubscribe();
  }

  private handleError(error: any) {
    this.error = 'Error fetching Pokémon data';
    this.loading = false;
  }
}
