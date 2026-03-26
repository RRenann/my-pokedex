import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Logo from '../../assets/logo.png';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';


/**
 * Componente da tela de login.
 * Permite ao usuário inserir email e senha para fazer login na aplicação.
 * Por que é usada: Para autenticar o usuário antes de acessar a Pokédex.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [IsLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const isButtonDisabled = IsLoading || !email || !password;
  
  /**
   * Função que processa o login do usuário.
   * Simula o processo de login e navega para a lista de Pokémons.
   * Por que é usada: Para validar as credenciais e permitir o acesso à aplicação.
   */
  const handleLogin = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      console.log('Login action', { email, password });
      navigation.reset({
        index: 0,
        routes: [{name: "PokemonList"}],
      })
      setIsLoading(false)
    }, 1500)


  };

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.textTop}>Pokédex</Text>
      </View>
      
      <View style={styles.boxMid}>
      <Text style={styles.titleInput}>E-mail</Text>
      <View style={styles.boxInput}>
      <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seuemail@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.textInput}
        />
      </View>
      <Text style={styles.titleInput}>Senha</Text>      
      <View style={styles.boxInput}>
      <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          secureTextEntry
          style={styles.textInput}
        />
      </View>        
      </View>
      <View style={styles.boxBottom}>
      <TouchableOpacity style={[styles.buttonEntrar, isButtonDisabled && {opacity:0.7}]} onPress={handleLogin} disabled={isButtonDisabled}>
          {IsLoading ?
          <ActivityIndicator color={theme.colors.text}/> 
            :
          <Text style={styles.buttonEntrarText}>Entrar</Text>
        }
        </TouchableOpacity>
      </View>
    </View>
  );
};