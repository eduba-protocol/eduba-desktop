import { createContext } from "preact";
import { diContainer } from "./inversify.config";

export const DiContext = createContext(diContainer);