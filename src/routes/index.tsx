import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../pages/Login';
import PokemonListScreen from '../pages/PokemonList';
import PokemonDetailScreen from '../pages/PokemonDetail';

export type RootStackParamList = {
    Login: undefined;
    PokemonList: undefined;
    PokemonDetail: {id: number};
}

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente que define o navegador de pilha da aplicação.
 * Configura as rotas para Login, PokemonList e PokemonDetail.
 * Por que é usada: Para gerenciar a navegação entre as telas da aplicação.
 */
export default function AppNavigator() {
    return (
        <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="PokemonList" component={PokemonListScreen}/>
            <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen}/>
        </Stack.Navigator>
    )
}