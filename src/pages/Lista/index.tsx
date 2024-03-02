import { useState } from "react";
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, Box, Button, ButtonGroup, ButtonText, Checkbox, CheckboxGroup, CheckboxIcon, CheckboxIndicator, CheckboxLabel, Fab, FabIcon, FabLabel, FlatList, GluestackUIProvider, HStack, Heading, Image, Input, InputField, InputIcon, InputSlot, SafeAreaView, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import { config } from '@gluestack-ui/config';
import { FontAwesome5 } from '@expo/vector-icons';

import bag from '../../../assets/Icons/bag.png';

export default function Lista() {

    const [lista, setLista] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
    const [itensSelecionadosLista, setItensSelecionadosLista] = useState([]);
    const [modalConfirmarLimpezaLista, setModalConfirmarLimpezaLista] = useState(false);
    const [modalCarregarItens, setModalCarregarItens] = useState(false);
    const [modalSalvarItens, setModalSalvarItens] = useState(false);

    const ItemDaLista = (props: any) => {
        return (
            <HStack h={"$16"} mb={props.item == lista.length ? "$48" : 0} justifyContent="space-between" alignItems="center" borderBottomWidth={1} borderBottomColor="#c39e80">
                <HStack alignItems="center" flex={1} mr="$10">
                    <Button onPress={() => alert("Dados do item")} variant="link" flex={1} justifyContent="flex-start">
                        {/* <FontAwesome5 name="shopping-bag" size={28} color="#222" /> */}
                        <Image alt="iconeDaLista" size="xs" source={bag} />
                        <VStack ml="$2">
                            <Text color="#333" fontSize={16} fontWeight="bold">Teste</Text>
                            <Text color="#444" fontSize={14}>qtd: 3</Text>
                        </VStack>
                    </Button>
                </HStack>
                <Button width={"$12"} variant="link" onPress={() => alert("Inserir no carrinho")}>
                    <FontAwesome5 name="arrow-right" size={20} color="#333" />
                </Button>
                {/* <Button width={"$12"} variant="link" onPress={() => alert("Excluir")}>
                    <FontAwesome5 name="trash" size={20} color="#e53935" />
                </Button> */}
            </HStack >
        )
    }

    return (
        <GluestackUIProvider config={config}>
            <SafeAreaView flex={1} backgroundColor='#d5b59c'>
                <Box mt="$5" p={"$6"}>
                    <HStack justifyContent="space-between">
                        <Button flex={1} mr="$5" bgColor="#b58154" $active-bg="#a67041" onPress={() => setModalCarregarItens(true)} >
                            <ButtonText>CARREGAR</ButtonText>
                        </Button>
                        <Button flex={1} bgColor="#b58154" $active-bg="#a67041" onPress={() => setModalSalvarItens(true)}>
                            <ButtonText>SALVAR</ButtonText>
                        </Button>
                    </HStack>
                    <HStack justifyContent="center" mb="$5" mt="$5">
                        {/* <Heading verticalAlign="middle">Lista</Heading> */}
                        {lista.length > 0 ?
                            <Button variant="link" onPress={() => setModalConfirmarLimpezaLista(true)}>
                                <ButtonText color="#f44336">Limpar tudo ({lista.length})</ButtonText>
                            </Button>
                            : null
                        }
                    </HStack>
                    <Input bgColor="rgba(255,255,255,0.8)" mb="$5">
                        <InputField placeholder="Procurar" />
                        <InputSlot  px="$3">
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
                    <Fab
                        size="md"
                        placement="bottom right"
                        isHovered={false}
                        isDisabled={false}
                        isPressed={false}
                        width={"$16"}
                        height={"$16"}
                        // height="$12" 
                        bottom="$56"
                        bg="#eee"
                        // right="$8"
                        onPress={() => alert("Novo item")}
                    >
                        <FabIcon as={() => <FontAwesome5 name="plus" size={16} />} mr="$1" />
                        {/* <FabLabel>Quick start</FabLabel> */}
                    </Fab>
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
        </GluestackUIProvider>
    )
}