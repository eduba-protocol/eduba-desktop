import register from "preact-custom-element";
import { Component, h } from "preact";
import { ImageDto } from "@/dtos/response/interfaces";
import { MainEventUnsubscriber } from "@/api/ipc/types";
import { ImageChangeEvent } from "@/events/common/main";

interface EdubaImageProps {
  publisher: string;
  image: string;
  title?: string;
  caption?: string;
}

interface EdubaImageState {
  image: ImageDto | null;
}

export class EdubaImage extends Component<EdubaImageProps, EdubaImageState> {
  public state: EdubaImageState = {
    image: null,
  };

  private removeListener: MainEventUnsubscriber;

  async componentDidMount() {
    this.removeListener = window.ipcEvents.on.ImageChangeEvent(
      async (evt: ImageChangeEvent) => {
        const { props } = this;
        if (
          evt.type !== "delete" &&
          evt.db === props.publisher &&
          evt.id === props.image
        ) {
          const image = await window.ipcSdk.image.load(evt.db, evt.id);
          this.setState({ image });
        }
      }
    );

    const { publisher: publisherId, image: imageId } = this.props;
    const image = await window.ipcSdk.image.load(publisherId, imageId);
    this.setState({ image });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render(props: EdubaImageProps, state: EdubaImageState) {
    if (!state.image) return;

    const imageEl = (
      <img
        src={`eduba://${state.image._db}/files/images/${state.image._id}.${state.image.ext}`}
        alt={state.image.alt}
        title={props.title}
      />
    );

    if (props.caption) {
      return (
        <figure>
          {imageEl}
          <figcaption>{props.caption}</figcaption>
        </figure>
      );
    }

    return imageEl;
  }
}

const observedAttributes: string[] = [];

register(EdubaImage, "eduba-image", observedAttributes, {
  shadow: false,
});
