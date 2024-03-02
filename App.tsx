import 'react-native-gesture-handler';
import { config } from '@gluestack-ui/config';
import { Box, GluestackUIProvider, Text } from '@gluestack-ui/themed';

import Routes from './src/routes';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Routes />
    </GluestackUIProvider>
  );
}