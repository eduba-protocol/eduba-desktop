import { h } from "preact";
import { DiContext, diContainer } from "./di";
import Alerts from "./components/alerts/alerts";
import Layout from "./layout/layout";
import AppRouter from "./router";

export default function App() {
  return (
    <DiContext.Provider value={diContainer}>
        <Layout>
            <AppRouter />
        </Layout>
        <Alerts />
    </DiContext.Provider>
  )
}
