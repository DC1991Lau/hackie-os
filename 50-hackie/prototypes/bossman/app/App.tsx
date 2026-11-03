import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatLayer } from './src/interaction/Chat';
import { NotebookLayer } from './src/interaction/Notebook';
import { AppLayer } from './src/interaction/Pager';
import { SheetLayer } from './src/interaction/Sheet';
import { StoriesLayer } from './src/interaction/Stories';
import { StoreProvider, useStore } from './src/interaction/store';
import { Background } from './src/ui/background';
import { useTheme } from './src/ui/theme';

/* Layers, bottom to top: Fundo · Views · Notebook · Scrim+Sheet · Orb · Conversa · Stories */
function Screen() {
  const t = useTheme();
  const { W, H, insetTop, insetBottom } = useStore();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    W.value = width; H.value = height; insetTop.value = insets.top; insetBottom.value = insets.bottom;
  }, [width, height, insets.top, insets.bottom]);
  return (
    <View style={[styles.device, { backgroundColor: t.ink }]}>
      <Background />
      <AppLayer />
      <NotebookLayer />
      <SheetLayer />
      <ChatLayer />
      <StoriesLayer />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <StoreProvider>
          <Screen />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  device: { flex: 1, overflow: 'hidden' },
});
