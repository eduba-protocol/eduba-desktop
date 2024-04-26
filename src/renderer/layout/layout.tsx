import { ComponentChildren, h } from "preact";
import Sidebar from "./sidebar/sidebar";
import ErrorBoundary from "../components/error-boundary";
import { useProvider } from "../hooks/use-provider.hook";
import { AppStore } from "../stores";
import { Bars3Icon } from "@heroicons/react/24/solid";

export interface LayoutProps {
  children?: ComponentChildren
}

export default function Layout({ children }: LayoutProps) {
  const appStore = useProvider<AppStore>(AppStore);

  return (
    <ErrorBoundary
      reportError={appStore.reportError}
      title="Something went wrong"
      message="Eduba experienced an error."
      resetLabel="Try again"
    >
      <div class="w-screen h-screen drawer lg:drawer-open ">
        <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col overflow-hidden relative">
          {/* Open/close drawer on mobile button */}
        <label
            htmlFor="sidebar-drawer"
            class="drawer-button lg:hidden px-2 text-base-500 absolute"
          >
            <Bars3Icon class="h-6 w-6 text-current" />
          </label>
          {children}
          

        </div>
        <div class="drawer-side text-base-content">
          <label htmlFor="sidebar-drawer" class="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </ErrorBoundary>
  );
}
