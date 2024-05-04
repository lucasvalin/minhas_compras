import { useState, useEffect, useRef } from 'react';
import { config } from '@gluestack-ui/config';
import { Box, Button, ButtonText, Fab, FabIcon, GluestackUIProvider, HStack, Heading, Input, InputField, InputIcon, InputSlot, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from '@gluestack-ui/themed';
import { Keyboard, Alert, ToastAndroid, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const db = firebase.database();
    const bounceValue = useRef(new Animated.Value(1)).current;

    const [index, setIndex] = useState(0);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [lista, setLista] = useState<Item[]>([]);
    const [carrinho, setCarrinho] = useState<Item[]>([]);
    const [precoCarrinho, setPrecoCarrinho] = useState<string>("");
    const [indiceItemSelecionado, setIndiceItemSelecionado] = useState<number>(-1);
    const [origemItemSelecionado, setOrigemItemSelecionado] = useState<string>("");
    const [itemSelecionado, setItemSelecionado] = useState<Item>({ descricao: "", preco: "", peso: "", quantidade: 1 });
    const [modalItem, setModalItem] = useState(false);
    const [itemNovo, setItemNovo] = useState(true);
    const [listaPadrao, setListaPadrao] = useState<Item[]>([]);
    const [usuario, setUsuario] = useState<string>("");

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardOpen(true)
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardOpen(false)
        );

        AsyncStorage.getItem("usuario").then(usuario => {
            if (usuario) {
                setUsuario(usuario);

                // Escute mudanças nos dados
                db.ref(`${usuario}/lista`).on('value', (res) => {
                    setLista(res.val() || []);
                });

                db.ref(`${usuario}/listaPadrao`).on('value', (res) => {
                    setListaPadrao(res.val() || []);
                });

                db.ref(`${usuario}/carrinho`).on('value', (res) => {
                    setCarrinho(res.val() || []);
                });

                // Lembre-se de remover os ouvintes quando o componente for desmontado
                return () => {
                    keyboardDidShowListener.remove();
                    keyboardDidHideListener.remove();
                    db.ref(`${usuario}/lista`).off('value');
                    db.ref(`${usuario}/listaPadrao`).off('value');
                    db.ref(`${usuario}/carrinho`).off('value');
                };
            }
        })
            .catch(err => {
                return () => {
                    keyboardDidShowListener.remove();
                    keyboardDidHideListener.remove();
                };
            })

    }, []);

    useEffect(() => {
        calcularCarrinho();
        animarCarrinho();
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
                    db.ref(`${usuario}/carrinho`).set(copiaCarrinho);
                    animarCarrinho();
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
                    db.ref(`${usuario}/lista`).set(copiaLista);
                }
                setItemSelecionado({ descricao: "", preco: "", peso: "", quantidade: 1 });
            }
            else {
                Alert.alert("Ops", "Você não informou os campos obrigatórios");
            }
        }
    }

    const consultarItem = (indice: number, origem: string) => {
        const dados = origem == "lista" ? lista[indice] : carrinho[indice];
        setItemSelecionado({
            descricao: dados.descricao,
            preco: dados.preco,
            peso: dados.peso,
            quantidade: dados.quantidade
        });
        setOrigemItemSelecionado(origem);
        setIndiceItemSelecionado(indice);
        setItemNovo(false);
        setModalItem(true);
    }

    const atualizarItemLista = () => {
        if (itemSelecionado) {
            if (itemSelecionado.descricao && itemSelecionado.quantidade) {
                if (itemSelecionado.preco) {
                    if (origemItemSelecionado == "lista") {

                        //Excluir da lista
                        let copiaLista = [...lista];
                        copiaLista.splice(indiceItemSelecionado, 1);
                        setLista(copiaLista);
                        db.ref(`${usuario}/lista`).set(copiaLista);

                        //Adicionar no carrinho
                        let copiaCarrinho = [...carrinho];
                        copiaCarrinho.push(
                            {
                                descricao: itemSelecionado.descricao,
                                preco: itemSelecionado.preco,
                                peso: itemSelecionado?.peso,
                                quantidade: itemSelecionado?.quantidade,
                            }
                        );
                        setCarrinho(copiaCarrinho);
                        db.ref(`${usuario}/carrinho`).set(copiaCarrinho);
                        ToastAndroid.show("Item movido para o carrinho", ToastAndroid.SHORT);
                    }
                    else if (origemItemSelecionado == "carrinho") {
                        //Atualizar no carrinho
                        let copiaCarrinho = [...carrinho];
                        copiaCarrinho[indiceItemSelecionado] = {
                            descricao: itemSelecionado.descricao,
                            preco: itemSelecionado.preco,
                            peso: itemSelecionado?.peso,
                            quantidade: itemSelecionado?.quantidade
                        }
                        setCarrinho(copiaCarrinho);
                        db.ref(`${usuario}/carrinho`).set(copiaCarrinho);
                    }
                }
                else {
                    if (origemItemSelecionado == "lista") {
                        //Atualizar na lista
                        let copiaLista = [...lista];
                        copiaLista[indiceItemSelecionado] = {
                            descricao: itemSelecionado.descricao,
                            preco: itemSelecionado.preco,
                            peso: itemSelecionado?.peso,
                            quantidade: itemSelecionado?.quantidade
                        }
                        setLista(copiaLista);
                        db.ref(`${usuario}/lista`).set(copiaLista);
                    }
                    else if (origemItemSelecionado == "carrinho") {
                        //Excluir do carrinho
                        let copiaCarrinho = [...carrinho];
                        copiaCarrinho.splice(indiceItemSelecionado, 1);
                        setCarrinho(copiaCarrinho);
                        db.ref(`${usuario}/carrinho`).set(copiaCarrinho);

                        //Adicionar na lista
                        let copiaLista = [...lista];
                        copiaLista.push(
                            {
                                descricao: itemSelecionado.descricao,
                                preco: itemSelecionado.preco,
                                peso: itemSelecionado?.peso,
                                quantidade: itemSelecionado?.quantidade
                            }
                        );
                        setLista(copiaLista);
                        db.ref(`${usuario}/lista`).set(copiaLista);
                        ToastAndroid.show("Item movido para a lista", ToastAndroid.SHORT);
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
            db.ref(`${usuario}/lista`).set(copiaLista);
        }
        else {
            let copiaCarrinho = [...carrinho];
            copiaCarrinho.splice(indice, 1);
            setCarrinho(copiaCarrinho);
            db.ref(`${usuario}/carrinho`).set(copiaCarrinho);
        }
    }

    const calcularCarrinho = () => {
        let total = 0.00
        carrinho.forEach(item => {
            let valor: number = item.peso ? (parseFloat(item.preco.replace(",", ".")) * parseFloat(item.peso.replace(",", ".")) * item.quantidade) : (parseFloat(item.preco.replace(",", ".") * item.quantidade));
            total += valor;
        });
        setPrecoCarrinho(total.toFixed(2).replace(".", ","));
    }

    const limparCarrinho = () => {
        setCarrinho([]);
        db.ref(`${usuario}/carrinho`).set([]);
    }

    const restaurarListaPadrao = () => {
        setLista(listaPadrao);
        db.ref(`${usuario}/lista`).set(listaPadrao);
        ToastAndroid.show("Lista padrão carregada", ToastAndroid.SHORT);
    }

    const salvarListaPadrao = () => {
        setListaPadrao(lista);
        db.ref(`${usuario}/listaPadrao`).set(lista);
        ToastAndroid.show("Lista padrão atualizada", ToastAndroid.SHORT);
    }

    const animarCarrinho = () => {
        Animated.sequence([
            Animated.timing(bounceValue, {
                toValue: 0.1, // Define o quanto o componente deve encolher
                duration: 200, // Duração da primeira animação em milissegundos
                easing: Easing.linear, // Tipo de animação
                useNativeDriver: true // Utiliza o driver nativo para a animação
            }),
            Animated.spring(bounceValue, {
                toValue: 1,
                tension: 120,
                friction: 4,
                useNativeDriver: true
            })
        ]).start();
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
                    bounceValue={bounceValue}
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
                                <InputField value={itemSelecionado.preco} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, preco: e }))} onBlur={() => itemSelecionado.preco ? setItemSelecionado(prevState => ({ ...prevState, preco: parseFloat(itemSelecionado.preco).toFixed(2).replace(".", ",") })) : null} keyboardType='decimal-pad' placeholder="Preço" />
                                <InputSlot pr="$3">
                                    <Text>R$</Text>
                                </InputSlot>
                            </Input>
                            <Input flex={1}>
                                <InputField value={itemSelecionado.peso ? itemSelecionado.peso.toString() : ""} onChangeText={(e) => setItemSelecionado(prevState => ({ ...prevState, peso: e }))} onBlur={() => itemSelecionado.peso ? setItemSelecionado(prevState => ({ ...prevState, peso: itemSelecionado.peso?.replace(".", ",") })) : null} keyboardType='decimal-pad' placeholder="Peso" />
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