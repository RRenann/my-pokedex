const capturedPhotoByPokemonId = new Map<number, string>();

export function setCapturedPhotoUri(pokemonId: number, uri: string): void {
  capturedPhotoByPokemonId.set(pokemonId, uri);
}

export function getCapturedPhotoUri(pokemonId: number): string | null {
  return capturedPhotoByPokemonId.get(pokemonId) ?? null;
}
