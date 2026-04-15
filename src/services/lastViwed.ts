import AsyncStorage from '@react-native-async-storage/async-storage';

export type LastViewedPokemon = {
 id: number;
 name: string;
 imageUrl: string;
 types: string[];
 savedAt: string;
};

export async function setLastViewedPokemon(pokemon: Omit<LastViewedPokemon, 'savedAt'>): Promise<void> {
 const lastViewed = { ...pokemon, savedAt: new Date().toISOString() };
 await AsyncStorage.setItem('@mypokedex/lastViewed:v2', JSON.stringify(lastViewed));
}

export async function getLastViewedPokemon() {
    const raw = await AsyncStorage.getItem('@mypokedex/lastViewed:v2');
    return raw ? JSON.parse(raw) : null;
}

export async function getLastPokemon(): Promise<number[]> {
 const favorites = await getLastViewedPokemon();
 return favorites ? [favorites.id] : [];
}
