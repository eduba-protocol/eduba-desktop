import { useContext, useEffect, useMemo } from "preact/hooks";
import { DiContext } from "../di";
import { ComponentController } from "../controllers/component.ctrl";
import { Container } from "inversify";

export function useController<PropsType, ControllerType extends ComponentController<PropsType>>(
  controllerClass: any,
  props?: PropsType,
  input?: unknown[]
) {
  if (!input) {
    input = []
  }

  const diContainer = useContext<Container>(DiContext);

  const ctrl = useMemo(() => diContainer.get<ControllerType>(controllerClass), input);

  if (props) {
    ctrl.setProps(props);
  }

  useEffect(() => {    
    if (ctrl.initialize) ctrl.initialize(props);
    return () => {
      if (ctrl.destroy) ctrl.destroy();
    };
  }, input);

  return ctrl;
}
