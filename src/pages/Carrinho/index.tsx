import { useState } from "react";
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Badge, BadgeIcon, BadgeText, Box, Button, ButtonGroup, ButtonText, Fab, FabIcon, FlatList, FormControl, FormControlLabel, GluestackUIProvider, HStack, Heading, Image, Input, InputField, InputIcon, InputSlot, SafeAreaView, Text, VStack } from "@gluestack-ui/themed";
import { config } from '@gluestack-ui/config';
import { Alert, Modal, StatusBar, TouchableOpacity } from 'react-native';
import { Animated } from "react-native";

import { FontAwesome5 } from '@expo/vector-icons';

import cart from '../../../assets/Icons/cart.png';

interface Item {
    descricao: string,
    preco: string,
    peso?: string,
    quantidade: number
}

interface Carrinho {
    carrinho: Item[],
    consultarItem: (indice: number, destino: string) => void;
    excluirItem: (indice: number, destino: string) => void;
    precoCarrinho: string;
    limparCarrinho: () => void;
    bounceValue: any;
}

export default function Carrinho(props: Carrinho) {

    const [busca, setBusca] = useState<string>("");

    const ItemDaLista = (props: any) => {
        if (props.item.descricao.toLowerCase().includes(busca.toLowerCase())) {
            return (
                <HStack h={"$20"} mb={props.item == props.total ? "$0" : 10} justifyContent="space-between" alignItems="center">
                    <HStack flex={1} py="$2" borderRadius={10} justifyContent="space-between" alignItems="center" bgColor="rgba(255,255,255,0.1)">
                        <Button onPress={() => props.consultarItem(props.indice, "carrinho")} h={"100%"} flex={1} $hover-bgColor="#aaa" variant="link">
                            <HStack alignItems="center">
                                <Image alt="iconeDaLista" size="xs" source={cart} />
                                <VStack ml="$4" width="70%">
                                    <Text color="$coolGray200" fontSize={16} numberOfLines={1} flex={1}>{props.item.descricao}</Text>
                                    <Text color="$coolGray400" fontSize={14}>Qtd: {props.item.quantidade}</Text>
                                    <Text color="$green600" fontSize={14} fontWeight="bold">R${props.item.peso ? (parseFloat(props.item.preco.replace(",", ".")) * parseFloat(props.item.peso.replace(",", "."))).toFixed(2).replace(".", ",") : parseFloat(props.item.preco.replace(",", ".")).toFixed(2).replace(".", ",")}</Text>
                                </VStack>
                            </HStack>
                        </Button>
                        <Button onPress={() =>
                            Alert.alert(
                                'Exclusão de Item',
                                'Tem certeza que deseja excluir o item?',
                                [
                                    {
                                        text: 'Cancelar',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Excluir',
                                        onPress: () => props.excluirItem(props.indice, "carrinho"),
                                    },
                                ],
                                { cancelable: false }
                            )
                        } variant="link" mr="$3" width="$10">
                            <FontAwesome5 name="trash" size={22} color="#f44336" />
                        </Button>
                    </HStack>
                </HStack >
            );
        }
    }

    return (
        <GluestackUIProvider config={config}>
            <StatusBar
                animated={true}
                backgroundColor="#13131a"
                hidden={false}
            />
            <SafeAreaView flex={1} backgroundColor='#13131a'>
                <Box flex={1} px={"$5"}>
                    <HStack justifyContent="space-between" mb="$10">
                        <Button onPress={() => Alert.alert(
                            'Limpar Carrinho',
                            'Tem certeza que deseja limpar o carrinho?',
                            [
                                {
                                    text: 'Cancelar',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Excluir',
                                    onPress: props.limparCarrinho,
                                },
                            ],
                            { cancelable: false }
                        )} bgColor="$red600">
                            <ButtonText color="#eee" fontWeight="bold" fontSize={16}>Limpar Carrinho</ButtonText>
                        </Button>
                        <Badge size="md" p="$2" bgColor="rgba(0,0,0,0)" variant="solid" borderRadius={5} action="success" >
                            <Animated.View style={{ flexDirection: "row", transform: [{ scale: props.bounceValue }] }}>
                                <BadgeText color="$green600" fontWeight="bold" mt="$1" fontSize={18} mr="$2">R${props.precoCarrinho || "0,00"}</BadgeText>
                                <BadgeIcon as={() => <FontAwesome5 name="shopping-cart" size={24} color="#eee" />} ml='$2' />
                            </Animated.View>
                        </Badge>
                    </HStack>
                    <Input bgColor="$white" mb="$5">
                        <InputField value={busca} onChangeText={(e) => setBusca(e)} placeholder="Procurar" />
                        <InputSlot px="$3">
                            <InputIcon as={() => <FontAwesome5 name="search" size={16} color="#aaa" />} />
                        </InputSlot>
                    </Input>
                    <Box flex={1}>
                        <FlatList
                            data={props.carrinho}
                            renderItem={({ item, index }) => (
                                <ItemDaLista item={item} indice={index} total={props.carrinho.length} consultarItem={props.consultarItem} excluirItem={props.excluirItem} />
                            )}
                        />
                    </Box>
                </Box>
            </SafeAreaView >
        </GluestackUIProvider >
    )
}