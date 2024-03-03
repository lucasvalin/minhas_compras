import { useState } from "react";
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Badge, BadgeIcon, BadgeText, Box, Button, ButtonGroup, ButtonText, Fab, FabIcon, FlatList, FormControl, FormControlLabel, GluestackUIProvider, HStack, Heading, Image, Input, InputField, InputIcon, InputSlot, SafeAreaView, Text, VStack } from "@gluestack-ui/themed";
import { config } from '@gluestack-ui/config';
import { Modal, StatusBar, TouchableOpacity } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

import cart from '../../../assets/Icons/cart.png';

export default function Carrinho() {

    const [lista, setLista] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    const [modalItemCarrinho, setModalitemCarrinho] = useState(false);

    const ItemDaLista = (props: any) => {
        return (
            <HStack h={"$20"} mb={props.item == lista.length ? "$48" : 10} justifyContent="space-between" alignItems="center">
                <HStack flex={1} py="$2" borderRadius={10} justifyContent="space-between" alignItems="center" bgColor="rgba(255,255,255,0.1)">
                    <Button h={"100%"} flex={1} $hover-bgColor="#aaa" variant="link" onPress={() => setModalitemCarrinho(true)}>
                        <HStack alignItems="center">
                            <Image alt="iconeDaLista" size="xs" source={cart} />
                            <VStack ml="$4" width="70%">
                                <Text color="$coolGray200" fontSize={16} numberOfLines={1} flex={1}>Arroz Sepé 5kG</Text>
                                <Text color="$coolGray400" fontSize={14}>Qtd: 10</Text>
                                <Text color="$green600" fontSize={14} fontWeight="bold">Preço R$14,90</Text>
                            </VStack>
                        </HStack>
                    </Button>
                    <Button variant="link" mr="$3" width="$10">
                        <FontAwesome5 name="trash" size={22} color="#f44336" />
                    </Button>
                    {/* <Heading fontSize={18} color="$green600">R$19,90</Heading> */}
                </HStack>
            </HStack >
        )
    }

    return (
        <GluestackUIProvider config={config}>
            <StatusBar
                animated={true}
                backgroundColor="#13131a"
                hidden={false}
            />
            <SafeAreaView flex={1} backgroundColor='#13131a'>
                <Box p={"$5"}>
                    <HStack justifyContent="space-between" mb="$10">
                        <Button bgColor="$red600">
                            <ButtonText color="#eee" fontWeight="bold" fontSize={16}>Limpar Carrinho</ButtonText>
                        </Button>
                        <Badge size="md" p="$2" bgColor="rgba(0,0,0,0)" variant="solid" borderRadius={5} action="success" >
                            <BadgeText color="$green600" fontWeight="bold" fontSize={18} mr="$2">R$0,00</BadgeText>
                            <BadgeIcon as={() => <FontAwesome5 name="shopping-cart" size={24} color="#eee" />} ml='$2' />
                        </Badge>
                    </HStack>
                    <Input bgColor="$white" mb="$5">
                        <InputField placeholder="Procurar" />
                        <InputSlot px="$3">
                            <InputIcon as={() => <FontAwesome5 name="search" size={16} color="#aaa" />} />
                        </InputSlot>
                    </Input>
                    <FlatList
                        data={lista}
                        renderItem={({ item }) => (
                            <ItemDaLista item={item} />
                        )}
                    // mb={"$16"}
                    // keyExtractor={(item) => lista.id}
                    />

                    {/* <Fab
                        size="md"
                        placement="bottom right"
                        isHovered={false}
                        isDisabled={false}
                        isPressed={false}
                        width={"$16"}
                        height={"$16"}
                        bottom="$40"
                        bg="$white"
                        onPress={() => alert("Novo item")}
                    >
                        <FabIcon as={() => <FontAwesome5 name="plus" size={16} />} mr="$1" />
                    </Fab> */}
                </Box>

                <AlertDialog
                    isOpen={modalItemCarrinho}
                    onClose={() => {
                        setModalitemCarrinho(false)
                    }}
                >
                    <AlertDialogBackdrop />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <Heading size="lg">Informações do Item</Heading>
                            <AlertDialogCloseButton>
                                <FontAwesome5 name="times" size={20} />
                            </AlertDialogCloseButton>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <FormControl isRequired>
                                <Input>
                                    <InputField placeholder="Arroz Sepé 5kg" />
                                </Input>
                            </FormControl>
                            <HStack>
                                <FormControl mt="$5" isRequired flex={1} mr="$5">
                                    <Input>
                                        <InputField keyboardType="decimal-pad" placeholder="R$19,90" />
                                    </Input>
                                </FormControl>
                                <FormControl mt="$5" isRequired flex={1}>
                                    <Input>
                                        <InputField keyboardType="decimal-pad" placeholder="1.2kg" />
                                    </Input>
                                </FormControl>
                            </HStack>
                            <HStack justifyContent="space-between" mt="$5">
                                <Button mr="$4"><FontAwesome5 name="minus" size={14} color="#fff" /></Button>
                                <Input flex={1}>
                                    <InputField keyboardType="numeric" placeholder="10" textAlign="center" />
                                </Input>
                                <Button ml="$4"><FontAwesome5 name="plus" size={14} color="#fff" /></Button>
                            </HStack>
                        </AlertDialogBody>
                        <AlertDialogFooter mt="$8">
                            <ButtonGroup space="lg">
                                <Button
                                    variant="solid"
                                    bgColor="$coolGray300"
                                    action="secondary"
                                    onPress={() => {
                                        setModalitemCarrinho(false)
                                    }}
                                    flex={1}
                                >
                                    <ButtonText color="#222">Sair</ButtonText>
                                </Button>
                                <Button
                                    bg="$success600"
                                    action="positive"
                                    onPress={() => {
                                        setModalitemCarrinho(false)
                                    }}
                                    flex={1}
                                >
                                    <ButtonText>Salvar</ButtonText>
                                </Button>
                            </ButtonGroup>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalItemCarrinho}
                    onRequestClose={() => {
                        setModalitemCarrinho(false);
                    }}>
                    <Box justifyContent="center" alignItems="center" width={"80%"} height={"50%"} bgColor="#fff">
                        <Button onPress={() => setModalitemCarrinho(false)}>
                            <ButtonText>Fechar</ButtonText>
                        </Button>
                    </Box>
                </Modal> */}

            </SafeAreaView >
        </GluestackUIProvider >
    )
}