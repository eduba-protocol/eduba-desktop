import { useContext } from "preact/hooks";
import { DiContext } from "../di";
import { Container, interfaces } from "inversify";

export function useProvider<T>(identifier: interfaces.ServiceIdentifier<T>): T {
  const diContainer = useContext<Container>(DiContext);
  return diContainer.get<T>(identifier);
}
