import { useState, useEffect } from 'react';
import { config } from '@gluestack-ui/config';
import { Box, Button, ButtonText, Fab, FabIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, GluestackUIProvider, HStack, Heading, Input, InputField, InputIcon, InputSlot, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, SafeAreaView, Text } from '@gluestack-ui/themed';
import { View, useWindowDimensions, Keyboard, StatusBar, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

//Telas
import Lista from '../Lista';
import Carrinho from '../Carrinho';

interface Item {
    descricao: string,
    preco: string,
    peso?: string,
    quantidade: number
}


export default function Compras() {
    const [index, setIndex] = useState(0);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [lista, setLista] = useState<Item[]>([]);
    const [indiceItemSelecionado, setIndiceItemSelecionado] = useState<number>(-1);
    const [itemSelecionado, setItemSelecionado] = useState<Item>({ descricao: "", preco: "", peso: "", quantidade: 1 });
    const [modalItem, setModalItem] = useState(false);
    const [itemNovo, setItemNovo] = useState(true);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardOpen(true)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardOpen(false)
        );

        // Lembre-se de remover os ouvintes quando o componente for desmontado
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const adicionarItemLista = () => {
        if (itemSelecionado) {
            if (itemSelecionado.descricao && itemSelecionado.preco && itemSelecionado.quantidade) {
                let copiaLista = [...lista];
                copiaLista.push({
                    descricao: itemSelecionado.descricao,
                    preco: itemSelecionado.preco,
                    peso: itemSelecionado.peso,
                    quantidade: itemSelecionado?.quantidade,
                });
                setLista(copiaLista);
            }
            else {
                Alert.alert("Ops", "Você não informou os campos obrigatórios");
            }
        }
    }

    const consultarItemLista = (indice: number) => {
        setItemSelecionado({
            descricao: lista[indice].descricao,
            preco: lista[indice].preco,
            peso: lista[indice].peso,
            quantidade: lista[indice].quantidade
        })
        setIndiceItemSelecionado(indice);
        setItemNovo(false);
        setModalItem(true);
    }

    const atualizarItemLista = () => {
        if (itemSelecionado) {
            if (itemSelecionado.descricao && itemSelecionado.preco && itemSelecionado.quantidade) {
                let copiaLista = [...lista];
                copiaLista[indiceItemSelecionado] = {
                    descricao: itemSelecionado.descricao,
                    preco: itemSelecionado.preco,
                    peso: itemSelecionado.peso,
                    quantidade: itemSelecionado?.quantidade,
                };
                setLista(copiaLista);
            }
            else {
                Alert.alert("Ops", "Você não informou os campos obrigatórios");
            }
        }
        setModalItem(false);
    }

    const excluirItemLista = () => {
        let copiaLista = [...lista];
        copiaLista.splice(indiceItemSelecionado, 1);
        setLista(copiaLista);
        setModalItem(false);
    }

    return (
        <GluestackUIProvider config={config}>
            {index == 0 ? <Lista lista={lista} consultarItemLista={consultarItemLista} /> : <Carrinho lista={lista} />}
            {isKeyboardOpen ? null :
                <Fab
                    size="md"
                    placement="bottom right"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    width={"$16"}
                    height={"$16"}
                    bottom="$20"
                    bg="$white"
                    $active-bg='#ddd'
                    onPress={() => [setItemNovo(true), setModalItem(true)]}
                >
                    <FabIcon as={() => <FontAwesome5 name="plus" size={20} />} />
                </Fab>
            }
            {isKeyboardOpen ? null :
                <HStack w="100%">
                    <Box flex={1} justifyContent='center' alignItems='center' bgColor={index == 0 ? '#444' : "#222"} borderRadius={0} h={50}>
                        <Button
                            onPress={() => setIndex(0)}
                            variant="link"
                            width="$10"
                        >
                            <Box width="$5" height="$5" borderRadius={"$full"} bgColor='red' position='absolute' zIndex={2} top={-2} right={-2} justifyContent='center' alignItems='center'><Text fontWeight='bold' color="#eee" fontSize={14}>3</Text></Box>
                            <FontAwesome5 name="clipboard-list" size={22} color={index == 0 ? '#eee' : "#444"} />
                        </Button>
                    </Box>
                    <Box flex={1} justifyContent='center' alignItems='center' bgColor={index == 1 ? '#444' : "#222"} borderRadius={0} h={50}>
                        <Button
                            onPress={() => setIndex(1)}
                            variant="link"
                            width="$10"
                        // flex={1}
                        >
                            <Box width="$5" height="$5" borderRadius={"$full"} bgColor='red' position='absolute' zIndex={2} top={-2} right={-2} justifyContent='center' alignItems='center'><Text fontWeight='bold' color="#eee" fontSize={14}>3</Text></Box>
                            <FontAwesome5 name="shopping-cart" size={22} color={index == 1 ? '#eee' : "#444"} />
                        </Button>
                    </Box>
                </HStack>
            }

            <Modal
                isOpen={modalItem}
                onClose={() => {
                    setModalItem(false)
                }}
                size="lg"
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">{index == 0 ? "Item da Lista" : "Item do Carrinho"}</Heading>
                        <ModalCloseButton>
                            <FontAwesome5 name="times" size={20} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Input>
                            <InputField value={itemSelecionado.descricao} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, descricao: e }))} placeholder="Descrição do Item" />
                            <InputSlot pr="$3">
                                {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                                <InputIcon
                                    as={() => <FontAwesome5 name="shopping-basket" size={16} color="#555" />}
                                    color="$darkBlue500"
                                />
                            </InputSlot>
                        </Input>
                        <HStack mt="$5">
                            <Input flex={1} mr="$3">
                                <InputField value={itemSelecionado.preco} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, preco: e }))} onBlur={() => setItemSelecionado(prevState => ({ ...prevState, preco: itemSelecionado.preco.replace(".", ",") }))} keyboardType='decimal-pad' placeholder="Preço" />
                                <InputSlot pr="$3">
                                    {/* <InputIcon
                                        as={() => <MaterialIcons name="attach-money" size={20} color="#555" />}
                                        color="$darkBlue500"
                                    /> */}
                                    <Text>R$</Text>
                                </InputSlot>
                            </Input>
                            <Input flex={1}>
                                <InputField value={itemSelecionado.peso ? itemSelecionado.peso.toString() : ""} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, peso: e }))} onBlur={() => setItemSelecionado(prevState => ({ ...prevState, peso: itemSelecionado.peso?.replace(".", ",") }))} keyboardType='decimal-pad' placeholder="Peso" />
                                <InputSlot pr="$3">
                                    {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                                    <InputIcon
                                        as={() => <FontAwesome5 name="weight-hanging" size={16} color="#555" />}
                                        color="$darkBlue500"
                                    />
                                </InputSlot>
                            </Input>
                        </HStack>
                        <HStack justifyContent="space-between" mt="$5">
                            <Button onPress={() => setItemSelecionado(prevState => ({ ...prevState, quantidade: itemSelecionado.quantidade > 1 ? itemSelecionado.quantidade - 1 : itemSelecionado.quantidade }))} width="$16" mr="$2" bgColor='#333' $active-bgColor='#222'>
                                <FontAwesome5 name="minus" color="#eee" />
                            </Button>
                            <Input flex={1}>
                                <InputField value={itemSelecionado.quantidade.toString()} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, quantidade: parseInt(e) }))} keyboardType='number-pad' textAlign='center' />
                            </Input>
                            <Button onPress={() => setItemSelecionado(prevState => ({ ...prevState, quantidade: itemSelecionado.quantidade + 1 }))} width="$16" ml="$2" bgColor='#333' $active-bgColor='#222'>
                                <FontAwesome5 name="plus" color="#eee" />
                            </Button>
                        </HStack>
                    </ModalBody>
                    <ModalFooter justifyContent={itemNovo ? "flex-end" : "space-between"}>
                        {itemNovo ? null :
                            <Button
                                // variant="outline"
                                size="sm"
                                action="negative"
                                mr="$3"
                                width={"$32"}
                                onPress={excluirItemLista}
                            >
                                <ButtonText fontSize={16}>Excluir</ButtonText>
                            </Button>
                        }
                        <Button
                            size="sm"
                            // action="positive"
                            borderWidth="$0"
                            width={"$32"}
                            onPress={itemNovo ? adicionarItemLista : atualizarItemLista}
                        >
                            <ButtonText fontSize={16}>{itemNovo ? "Adicionar" : "Atualizar"}</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </GluestackUIProvider >
    );
}