import { Outlet } from "react-router";
import { RootProvider } from "./providers";

export default function RootLayout() {
  return (
    <RootProvider>
      <Outlet />
    </RootProvider>
  );
}
