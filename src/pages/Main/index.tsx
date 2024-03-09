import { useState, useEffect } from 'react';
import { config } from '@gluestack-ui/config';
import { Box, Button, ButtonText, Fab, FabIcon, GluestackUIProvider, HStack, Heading, Input, InputField, InputIcon, InputSlot, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from '@gluestack-ui/themed';
import { Keyboard, Alert, ToastAndroid } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

//Firebase
import firebase from '../../../firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";

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

    const database = firebase.database();
    const listaRef = database.ref('lista');
    const listaPadraoRef = database.ref('lista_padrao');
    const carrinhoRef = database.ref('carrinho');

    const [index, setIndex] = useState(0);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [lista, setLista] = useState<Item[]>([]);
    const [carrinho, setCarrinho] = useState<Item[]>([]);
    const [precoCarrinho, setPrecoCarrinho] = useState<string>("");
    const [indiceItemSelecionado, setIndiceItemSelecionado] = useState<number>(-1);
    const [itemSelecionado, setItemSelecionado] = useState<Item>({ descricao: "", preco: "", peso: "", quantidade: 1 });
    const [modalItem, setModalItem] = useState(false);
    const [itemNovo, setItemNovo] = useState(true);
    const [listaPadrao, setListaPadrao] = useState<Item[]>([]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardOpen(true)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardOpen(false)
        );


        // //Obtendo valores iniciais do banco
        // listaRef.on('value', (res) => {
        //     setLista(res);
        // })

        // listaPadraoRef.on('value', (res) => {
        //     setListaPadrao(res);
        // })

        // carrinhoRef.on('value', (res) => {
        //     setCarrinho(res);
        // })


        // Escute mudanças nos dados
        dataRef.on('value', (res) => {
            console.log(res);
        });

        // Lembre-se de remover os ouvintes quando o componente for desmontado
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            ref.off('value')
        };
    }, []);

    useEffect(() => {
        calcularCarrinho();
    }, [carrinho]);

    const novoItem = () => {
        setItemSelecionado({ descricao: "", preco: "", peso: "", quantidade: 1 });
        setItemNovo(true)
        setModalItem(true)
    }

    const adicionarItemLista = () => {
        if (itemSelecionado) {
            if (itemSelecionado.descricao && itemSelecionado.quantidade) {
                if (itemSelecionado.preco) {
                    //Verificando se o item ja existe no carrinho antes de adiciona-lo
                    if (carrinho.find(item => item.descricao === itemSelecionado.descricao)) {
                        ToastAndroid.show("Este item ja existe no carrinho", ToastAndroid.SHORT);
                        return;
                    }
                    let copiaCarrinho = [...carrinho];
                    copiaCarrinho.push({
                        descricao: itemSelecionado.descricao,
                        preco: itemSelecionado.preco,
                        peso: itemSelecionado?.peso.replace(".", ","),
                        quantidade: itemSelecionado.quantidade,
                    });
                    setCarrinho(copiaCarrinho);
                    console.log(copiaCarrinho);

                }
                else {
                    //Verificando se o item ja existe na lista antes de adiciona-lo
                    if (lista.find(item => item.descricao === itemSelecionado.descricao)) {
                        ToastAndroid.show("Este item ja existe na lista", ToastAndroid.SHORT);
                        return;
                    }
                    let copiaLista = [...lista];
                    copiaLista.push({
                        descricao: itemSelecionado.descricao,
                        preco: itemSelecionado?.preco,
                        peso: itemSelecionado?.peso,
                        quantidade: itemSelecionado?.quantidade,
                    });
                    setLista(copiaLista);
                }
                setItemSelecionado({ descricao: "", preco: "", peso: "", quantidade: 1 });
            }
            else {
                Alert.alert("Ops", "Você não informou os campos obrigatórios");
            }
        }
    }

    const consultarItem = (indice: number, destino: string) => {
        const dados = destino == "lista" ? lista[indice] : carrinho[indice];
        setItemSelecionado({
            descricao: dados.descricao,
            preco: dados.preco,
            peso: dados.peso,
            quantidade: dados.quantidade
        });
        setIndiceItemSelecionado(indice);
        setItemNovo(false);
        setModalItem(true);
    }

    const atualizarItemLista = () => {
        if (itemSelecionado) {
            if (itemSelecionado.descricao && itemSelecionado.quantidade) {
                if (itemSelecionado.preco) {
                    let copiaCarrinho = [...carrinho];
                    copiaCarrinho[indiceItemSelecionado] = {
                        descricao: itemSelecionado.descricao,
                        preco: itemSelecionado.preco,
                        peso: itemSelecionado?.peso,
                        quantidade: itemSelecionado?.quantidade,
                    };
                    setCarrinho(copiaCarrinho);

                    //Removendo o item da lista caso ele tenha sido movido para o carrinho
                    if (lista.find(item => item.descricao == itemSelecionado.descricao)) {
                        let copiaLista = [...lista];
                        const indice = copiaLista.findIndex(item => item.descricao == itemSelecionado.descricao);
                        copiaLista.splice(indice, 1);
                        setLista(copiaLista);
                        ToastAndroid.show("Item movido para o carrinho", ToastAndroid.SHORT);
                    }
                }
                else {
                    let copiaLista = [...lista];
                    copiaLista[indiceItemSelecionado] = {
                        descricao: itemSelecionado.descricao,
                        preco: itemSelecionado?.preco,
                        peso: itemSelecionado?.peso,
                        quantidade: itemSelecionado?.quantidade,
                    };
                    setLista(copiaLista);
                    ToastAndroid.show("Item movido para a lista", ToastAndroid.SHORT);

                    //Removendo o item do carrinho caso ele tenha sido movido para a lista
                    if (carrinho.find(item => item.descricao == itemSelecionado.descricao)) {
                        let copiaCarrinho = [...carrinho];
                        const indice = copiaCarrinho.findIndex(item => item.descricao == itemSelecionado.descricao);
                        copiaCarrinho.splice(indice, 1);
                        setCarrinho(copiaCarrinho);
                    }
                }
            }
            else {
                Alert.alert("Ops", "Você não informou os campos obrigatórios");
            }
        }

        setModalItem(false);
    }

    const excluirItem = (indice: number, destino: string) => {
        if (destino == "lista") {
            let copiaLista = [...lista];
            copiaLista.splice(indice, 1);
            setLista(copiaLista);
        }
        else {
            let copiaCarrinho = [...carrinho];
            copiaCarrinho.splice(indice, 1);
            setCarrinho(copiaCarrinho);
        }
    }

    const calcularCarrinho = () => {
        let total = 0.00
        carrinho.forEach(item => {
            let valor: number = item.peso ? (parseFloat(item.preco.replace(",", ".")) * parseFloat(item.peso) * item.quantidade) : (parseFloat(item.preco.replace(",", ".") * item.quantidade));
            total += valor;
        });
        setPrecoCarrinho(total.toFixed(2).replace(".", ","));
    }

    const limparCarrinho = () => {
        setCarrinho([]);
    }

    const restaurarListaPadrao = () => {
        setLista(listaPadrao);
        ToastAndroid.show("Lista padrão carregada", ToastAndroid.SHORT);
    }

    const salvarListaPadrao = () => {
        setListaPadrao(lista);
        ToastAndroid.show("Lista padrão atualizada", ToastAndroid.SHORT);
    }

    return (
        <GluestackUIProvider config={config}>
            {index == 0 ?
                <Lista
                    lista={lista}
                    consultarItem={consultarItem}
                    excluirItem={excluirItem}
                    restaurarListaPadrao={restaurarListaPadrao}
                    salvarListaPadrao={salvarListaPadrao}
                /> :
                <Carrinho
                    carrinho={carrinho}
                    consultarItem={consultarItem}
                    excluirItem={excluirItem}
                    precoCarrinho={precoCarrinho}
                    limparCarrinho={limparCarrinho}
                />
            }
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
                    onPress={novoItem}
                >
                    <FabIcon as={() => <FontAwesome5 name="plus" size={20} />} />
                </Fab>
            }
            {isKeyboardOpen ? null :
                <HStack w="100%">
                    <Button
                        onPress={() => setIndex(0)}
                        variant="link"
                        flex={1} justifyContent='center' alignItems='center' bgColor={index == 0 ? '#444' : "#222"} borderRadius={0} h={50}
                    >
                        <Box bgColor={index == 0 ? '#444' : "#222"}>
                            {lista.length > 0 ? <Box width="$5" height="$5" borderRadius={"$full"} bgColor='red' position='absolute' zIndex={2} top={-10} right={-10} justifyContent='center' alignItems='center'><Text fontWeight='bold' color="#eee" fontSize={14}>{lista.length}</Text></Box> : null}
                            <FontAwesome5 name="clipboard-list" size={22} color={index == 0 ? '#eee' : "#444"} />
                        </Box>
                    </Button>
                    <Button
                        onPress={() => setIndex(1)}
                        variant="link"
                        flex={1} justifyContent='center' alignItems='center' bgColor={index == 1 ? '#444' : "#222"} borderRadius={0} h={50}
                    >
                        <Box bgColor={index == 1 ? '#444' : "#222"}>
                            {carrinho.length > 0 ? <Box width="$5" height="$5" borderRadius={"$full"} bgColor='red' position='absolute' zIndex={2} top={-10} right={-10} justifyContent='center' alignItems='center'><Text fontWeight='bold' color="#eee" fontSize={14}>{carrinho.length}</Text></Box> : null}
                            <FontAwesome5 name="shopping-cart" size={22} color={index == 1 ? '#eee' : "#444"} />
                        </Box>
                    </Button>
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
                                <InputField value={itemSelecionado.preco} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, preco: e }))} onBlur={() => setItemSelecionado(prevState => ({ ...prevState, preco: parseFloat(itemSelecionado.preco).toFixed(2).replace(".", ",") }))} keyboardType='decimal-pad' placeholder="Preço" />
                                <InputSlot pr="$3">
                                    <Text>R$</Text>
                                </InputSlot>
                            </Input>
                            <Input flex={1}>
                                <InputField value={itemSelecionado.peso ? itemSelecionado.peso.toString() : ""} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, peso: e }))} onBlur={() => setItemSelecionado(prevState => ({ ...prevState, peso: itemSelecionado.peso?.replace(".", ",") }))} keyboardType='decimal-pad' placeholder="Peso" />
                                <InputSlot pr="$3">
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
                    <ModalFooter justifyContent={"space-between"}>
                        <Text fontSize={14} color='#555'>{itemSelecionado.preco ? "Salvar no Carrinho" : "Salvar na Lista"}</Text>
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