import { useRef, useState, useEffect } from 'react';
import { Button, ButtonText, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, GluestackUIProvider, Heading, Input, InputField, SafeAreaView, Text } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import LottieView from 'lottie-react-native';
import { StatusBar, ToastAndroid } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Firebase
import firebase from '../../../firebase';

interface User {
    usuario: string;
    senha: string;
}

export default function Login() {
    const navigation = useNavigation();
    const animation = useRef(null);
    const db = firebase.database();

    const [usuario, setUsuario] = useState<string>("");
    const [senha, setSenha] = useState<string>("");

    useEffect(() => {
        AsyncStorage.getItem("usuario").then(usuario => {
            if (usuario) {
                navigation.navigate("Compras");
            }
        })
    }, []);

    const handleLogin = () => {
        db.ref("usuarios").once("value").then((value) => {
            const autenticado = Object.values(value.val()).filter(user => user.usuario === usuario && user.senha === senha).length > 0;
            if (autenticado) {
                AsyncStorage.setItem("usuario", usuario);
                navigation.navigate("Compras");
            }
            else {
                ToastAndroid.show("Usuario ou senha incorreta", ToastAndroid.SHORT);
            }
        });
    }

    return (
        <GluestackUIProvider config={config}>
            <StatusBar
                animated={true}
                backgroundColor="#2a001c"
                hidden={false}
            />
            <SafeAreaView flex={1} justifyContent='center' alignItems='center' backgroundColor='#2a001c'>
                <LottieView
                    autoPlay
                    // loop={false}
                    ref={animation}
                    style={{
                        width: 250,
                        height: 250,
                        backgroundColor: '#2a001c',
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require('../../../assets/Icons/supermarket_2.json')}
                />
                <Heading color='#eee'>Minhas Compras</Heading>
                <FormControl
                    w={"80%"}
                    mt="$5"
                    mb="$5"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    isRequired={true}
                >
                    <Input>
                        <InputField color="#eee" value={usuario} onChangeText={(e) => setUsuario(e)} placeholder="usuario" />
                    </Input>
                    <FormControlError>
                        {/* <FormControlErrorIcon as={AlertCircleIcon} /> */}
                        <FormControlErrorText>
                            Informe seu e-mail
                        </FormControlErrorText>
                    </FormControlError>

                </FormControl>
                <FormControl
                    w={"80%"}
                    mb="$12"
                    size="md"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    isRequired={true}
                >
                    <Input>
                        <InputField color="#eee" value={senha} onChangeText={(e) => setSenha(e)} type='password' placeholder="******" />
                    </Input>
                    <FormControlHelper alignSelf='flex-end'>
                        {/* <FormControlHelperText>Recuperar Senha</FormControlHelperText> */}
                        <Button size="sm" variant="link">
                            <ButtonText>Recuperar Senha</ButtonText>
                        </Button>
                    </FormControlHelper>
                    <FormControlError>
                        <FormControlErrorText>
                            Informe sua senha
                        </FormControlErrorText>
                    </FormControlError>
                </FormControl>

                <Button onPress={handleLogin} size="md" isDisabled={false} isFocusVisible={false} mb={"30%"}>
                    <ButtonText>ENTRAR</ButtonText>
                </Button>

            </SafeAreaView>
        </GluestackUIProvider>
    );
}