import { useState, Dispatch, SetStateAction } from "react";
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Box, Button, ButtonGroup, ButtonText, Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator, CheckboxLabel, Fab, FabIcon, FabLabel, FlatList, GluestackUIProvider, HStack, Heading, Image, Input, InputField, InputIcon, InputSlot, SafeAreaView, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { config } from '@gluestack-ui/config';
import { FontAwesome5 } from '@expo/vector-icons';
import { Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import bag from '../../../assets/Icons/bag.png';
interface Item {
    descricao: string,
    preco: string,
    peso?: string,
    quantidade: number
}

interface Lista {
    lista: Item[],
    consultarItem: (indice: number, destino: string) => void;
    excluirItem: (indice: number, destino: string) => void;
    restaurarListaPadrao: () => void;
    salvarListaPadrao: () => void;
}

export default function Lista(props: Lista) {

    const navigation = useNavigation();

    const [modalConfirmarLimpezaLista, setModalConfirmarLimpezaLista] = useState(false);
    const [modalCarregarItens, setModalCarregarItens] = useState(false);
    const [modalSalvarItens, setModalSalvarItens] = useState(false);
    const [busca, setBusca] = useState<string>("");

    const ItemDaLista = (props: any) => {
        // console.log(props);
        if (props.item.descricao.toLowerCase().includes(busca.toLowerCase())) {
            return (
                <HStack h={"$16"} mb={props.item == props.total ? "$48" : 0} justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderBottomColor="#c39e80">
                    <HStack alignItems="center" flex={1} mr="$10">
                        <Button onPress={() => props.consultarItem(props.indice, "lista")} variant="link" flex={1} justifyContent="flex-start">
                            {/* <FontAwesome5 name="shopping-bag" size={28} color="#222" /> */}
                            <Image alt="iconeDaLista" size="xs" source={bag} />
                            <VStack ml="$2">
                                <Text color="#333" fontSize={16} fontWeight="bold">{props.item.descricao}</Text>
                                <Text color="#444" fontSize={14}>qtd: {props.item.quantidade}</Text>
                            </VStack>
                        </Button>
                    </HStack>
                    <Button onPress={() =>
                        Alert.alert(
                            'Exclusão de Item',
                            'Tem certeza que deseja excluir o item?',
                            [
                                {
                                    text: 'Cancelar',
                                    // onPress: () => console.log('Cancelado'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Excluir',
                                    onPress: () => props.excluirItem(props.indice, "lista"),
                                },
                            ],
                            { cancelable: false }
                        )
                    } width={"$12"} variant="link" $active-backgroundColor="#c39e80">
                        <FontAwesome5 name="trash" size={22} color="#f44336" />
                    </Button>
                    {/* <Button width={"$12"} variant="link" onPress={() => alert("Excluir")}>
                    <FontAwesome5 name="trash" size={20} color="#e53935" />
                </Button> */}
                </HStack >
            );
        }
    }

    return (
        <GluestackUIProvider config={config}>
            <StatusBar
                animated={true}
                backgroundColor="#d5b59c"
                hidden={false}
            />
            <SafeAreaView flex={1} backgroundColor='#d5b59c'>
                <Box p={"$6"}>
                    <HStack justifyContent="space-between">
                        <Button onPress={() => Alert.alert(
                            'Restaurar Lista Padrão',
                            'Você irá substituir a lista atual, tem certeza que deseja avançar?',
                            [
                                {
                                    text: 'Não',
                                    // onPress: () => console.log('Cancelado'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Sim',
                                    onPress: props.restaurarListaPadrao,
                                },
                            ],
                            { cancelable: false }
                        )
                        }
                            flex={1} mr="$5" bgColor="#b58154" $active-bg="#a67041" >
                            <ButtonText>CARREGAR</ButtonText>
                        </Button>
                        <Button onPress={() => Alert.alert(
                            'Salvar Lista Padrão',
                            'Você irá substituir a lista padrão atual por esta, tem certeza?',
                            [
                                {
                                    text: 'Não',
                                    // onPress: () => console.log('Cancelado'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Sim',
                                    onPress: props.salvarListaPadrao,
                                },
                            ],
                            { cancelable: false }
                        )
                        } flex={1} bgColor="#b58154" $active-bg="#a67041">
                            <ButtonText>SALVAR</ButtonText>
                        </Button>
                    </HStack>
                    <HStack justifyContent="center" mb="$5" mt="$5">
                        {/* <Heading verticalAlign="middle">Lista</Heading> */}
                        {/* {props.lista.length > 0 ?
                            <Button variant="link" onPress={() => setModalConfirmarLimpezaLista(true)}>
                                <ButtonText color="#f44336">Limpar tudo ({props.lista.length})</ButtonText>
                            </Button>
                            : null
                        } */}
                    </HStack>
                    <Input bgColor="rgba(255,255,255,0.8)" mb="$5">
                        <InputField value={busca} onChangeText={(e) => setBusca(e)} placeholder="Procurar" />
                        <InputSlot px="$3">
                            <InputIcon as={() => <FontAwesome5 name="search" size={16} color="#aaa" />} />
                        </InputSlot>
                    </Input>
                    <FlatList
                        data={props.lista}
                        renderItem={({ item, index }) => (
                            <ItemDaLista item={item} indice={index} total={props.lista.length} consultarItem={props.consultarItem} excluirItem={props.excluirItem} />
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
                    isOpen={modalConfirmarLimpezaLista}
                    onClose={() => {
                        setModalConfirmarLimpezaLista(false)
                    }}
                >
                    <AlertDialogBackdrop />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <Heading size="lg">Atenção</Heading>
                            <AlertDialogCloseButton>
                                <FontAwesome5 name="times" size={20} />
                            </AlertDialogCloseButton>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Text size="sm">
                                Tem certeza que deseja limpar a lista?
                            </Text>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <ButtonGroup space="lg">
                                <Button
                                    variant="outline"
                                    action="secondary"
                                    onPress={() => {
                                        setModalConfirmarLimpezaLista(false)
                                    }}
                                >
                                    <ButtonText>Cancelar</ButtonText>
                                </Button>
                                <Button
                                    bg="$error600"
                                    action="negative"
                                    onPress={() => {
                                        setModalConfirmarLimpezaLista(false)
                                    }}
                                >
                                    <ButtonText>Confirmar</ButtonText>
                                </Button>
                            </ButtonGroup>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog
                    isOpen={modalCarregarItens}
                    onClose={() => {
                        setModalCarregarItens(false)
                    }}
                >
                    <AlertDialogBackdrop />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <Heading size="lg">Restaurar Lista Padrão</Heading>
                            <AlertDialogCloseButton>
                                <FontAwesome5 name="times" size={20} />
                            </AlertDialogCloseButton>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Text size="sm">
                                Restaurar a lista irá substituir todas as modificações não salvas, deseja continuar?
                            </Text>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <ButtonGroup space="lg">
                                <Button
                                    variant="outline"
                                    action="secondary"
                                    onPress={() => {
                                        setModalCarregarItens(false)
                                    }}
                                >
                                    <ButtonText>Cancelar</ButtonText>
                                </Button>
                                <Button
                                    bg="$success600"
                                    action="positive"
                                    onPress={() => {
                                        setModalCarregarItens(false)
                                    }}
                                >
                                    <ButtonText>Confirmar</ButtonText>
                                </Button>
                            </ButtonGroup>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog
                    isOpen={modalSalvarItens}
                    onClose={() => {
                        setModalSalvarItens(false)
                    }}
                >
                    <AlertDialogBackdrop />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <Heading size="lg">Atualizar Lista Padrão</Heading>
                            <AlertDialogCloseButton>
                                <FontAwesome5 name="times" size={20} />
                            </AlertDialogCloseButton>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Text size="sm">
                                Salvar os itens irá esta lista como padrão, deseja continuar?
                            </Text>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <ButtonGroup space="lg">
                                <Button
                                    variant="outline"
                                    action="secondary"
                                    onPress={() => {
                                        setModalSalvarItens(false)
                                    }}
                                >
                                    <ButtonText>Cancelar</ButtonText>
                                </Button>
                                <Button
                                    bg="$success600"
                                    action="positive"
                                    onPress={() => {
                                        setModalSalvarItens(false)
                                    }}
                                >
                                    <ButtonText>Confirmar</ButtonText>
                                </Button>
                            </ButtonGroup>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SafeAreaView>
        </GluestackUIProvider >
    )
}