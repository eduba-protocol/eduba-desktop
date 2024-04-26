import { h } from "preact";
import { ShareIcon } from "@heroicons/react/24/solid";
import { ShareButtonController, ShareButtonProps } from "./share-button.ctrl";
import { useController } from "@/renderer/hooks";

export default function ShareButton(props: ShareButtonProps) {
  const ctrl = useController<ShareButtonProps, ShareButtonController>(
    ShareButtonController,
    props
  );

  return (
    <button {...props} onClick={ctrl.copyToClipboard}>
      <ShareIcon class="w-6 h-6 text-inherit" />
    </button>
  );
}
