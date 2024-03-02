import * as React from 'react';
import { config } from '@gluestack-ui/config';
import { Box, Button, ButtonText, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, GluestackUIProvider, Heading, Input, InputField, SafeAreaView, Text } from '@gluestack-ui/themed';
import { View, useWindowDimensions, Keyboard } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

//Telas
import Lista from '../Lista';
import Carrinho from '../Carrinho';

type RouteProps = {
    key: string;
    title: string;
};

export default function Compras() {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'lista', title: 'Lista' },
        { key: 'carrinho', title: 'Carrinho' },
    ]);
    const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

    const renderScene = ({ route }: { route: RouteProps }) => {
        switch (route.key) {
            case 'lista':
                return <Lista />;
            case 'carrinho':
                return <Carrinho />;
            default:
                return <View />; // Se nenhum caso for correspondido, retorne algo padrão
        }
    };

    const renderTabBar = (props: any) => {
        // console.log(props.navigationState.index);
        return (
            <TabBar
                {...props}
                renderIcon={({ route, focused, color }) => {
                    return (
                        <Box>
                            <Box width="$6" height={"$6"} borderRadius={"$full"} bgColor='red' position='absolute' zIndex={2} top={-8} right={-15} justifyContent='center' alignItems='center'><Text fontWeight='bold' color="#eee">3</Text></Box>
                            <FontAwesome5 size={24} color={color} name={route.key == "lista" ? "clipboard-list" : "shopping-cart"} />
                        </Box>
                    );
                }}
                renderLabel={({ route, focused, color }) => {
                    return (
                        <Text style={{ color, margin: 8, fontSize: 14 }}>
                            {route.title}
                        </Text>
                    );
                }}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{ backgroundColor: "#333", display: isKeyboardOpen ? 'none' : 'block' }}
            />

        )
    };

    React.useEffect(() => {
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

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            tabBarPosition="bottom"
        // onSwipeStart={}
        // onSwipeEnd={}
        />
    );
}