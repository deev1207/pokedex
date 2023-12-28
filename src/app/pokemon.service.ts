// pokemon.service.ts

import axios from 'axios';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Pokemon } from './pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private habitatUrl = 'https://pokeapi.co/api/v2/pokemon-species';
  private evolution_url = '';
  private habitat = '';
  private evolves_to = 'NA';
  private baby = 'NA';
  public sprites_front = '';
  public sprites_back = '';
  private sourceLinksSource = new BehaviorSubject<string[]>([]);
  sourceLinks$ = this.sourceLinksSource.asObservable();
  private details = new BehaviorSubject<any>([]);
  details$ = this.details.asObservable();
  private abilities = new BehaviorSubject<any>([]);
  abilities$ = this.abilities.asObservable();

  updateSourceLinks(links: string[]): void {
    this.sourceLinksSource.next(links);
  }

  updateAbilities(pokemonAbilities: any): void {
    this.abilities.next(pokemonAbilities);
    console.log('Abilities:', pokemonAbilities);
  }

  updateDetails(pokemonDetails: any): void {
    this.details.next(pokemonDetails);
    console.log('Details:', pokemonDetails);
  }

  constructor() {}

  getPokemonAbility(idOrName: string): Observable<Pokemon> {
    return new Observable((observer) => {
      axios
        .get(`${this.apiUrl}/${idOrName}/`)
        .then((response) => {
          const data = response.data;
          if (data.sprites.front_shiny != null) this.sprites_front = data.sprites.front_shiny;
          else this.sprites_front = data.sprites.front_default;
          if (data.sprites.back_shiny != null) this.sprites_back = data.sprites.back_shiny;
          else this.sprites_back = data.sprites.back_default;
          this.updateSourceLinks([this.sprites_front, this.sprites_back]);

          const abilities: any = {
            abilities: data.abilities,
            base_stats: data.stats,
          };
          this.updateAbilities(abilities);

          const pokemon: any = {
            name: data.name,
            type: data.types[0]?.type?.name || 'N/A',
            height: data.height || 'N/A',
            weight: data.weight || 'N/A',
            moveset: data.moves || 'N/A',
          };
          this.getHabitat(idOrName).subscribe((habitatData) => {
            pokemon.habitat = habitatData.habitat;
            pokemon.evolves_to = habitatData.evolves_to;
            pokemon.baby = habitatData.baby;

            // Update the details
            this.updateDetails(pokemon);

            observer.next(pokemon);
            observer.complete();
          });
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getHabitat(idOrName: string): Observable<any> {
    this.baby = 'NA';
    this.evolves_to = 'NA';

    return new Observable((observer) => {
      axios
        .get(`${this.habitatUrl}/${idOrName}/`)
        .then((response) => {
          const data = response.data;
          this.habitat = data.habitat.name;
          this.evolution_url = data.evolution_chain.url;

          axios
            .get(this.evolution_url)
            .then((response) => {
              this.evolves_to = response.data.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species?.name || 'NA';
              this.baby = response.data.chain?.species?.name || 'NA';

              const pokemon: any = {
                habitat: this.habitat,
                evolves_to: this.evolves_to,
                baby: this.baby,
              };

              observer.next(pokemon);
              observer.complete();
            })
            .catch((error) => {
              const pokemon: any = {
                habitat: this.habitat,
                evolves_to: this.evolves_to,
                baby: this.baby,
              };

              observer.next(pokemon);
              observer.complete();
            });
        })
        .catch(() => {
          const pokemon: any = {
            habitat: this.habitat,
            evolves_to: this.evolves_to,
            baby: this.baby,
          };

          observer.next(pokemon);
          observer.complete();
        });
    });
  }
}
