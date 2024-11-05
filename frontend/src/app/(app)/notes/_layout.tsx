import { Provider } from "react-redux";
import { store } from "@/shared/store";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
