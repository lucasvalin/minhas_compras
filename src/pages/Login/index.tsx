import { useRef } from 'react';
import { Button, ButtonText, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, GluestackUIProvider, Heading, Input, InputField, SafeAreaView, Text } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const navigation = useNavigation();
    const animation = useRef(null);

    const handleLogin = () => {
        navigation.navigate("Compras");
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
                        <InputField placeholder="endereco@email.com" />
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
                        <InputField type='password' placeholder="******" />
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