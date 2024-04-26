import register from "preact-custom-element";
import { Component, h } from "preact";
import { VideoDto } from "@/dtos/response/interfaces";
import { MainEventUnsubscriber } from "@/api/ipc/types";
import { VideoChangeEvent } from "@/events/common/main";

interface EdubaVideoProps {
  publisher: string;
  video: string;
  caption?: string;
}

interface EdubaVideoState {
  video: VideoDto | null;
}

export class EdubaVideo extends Component<EdubaVideoProps, EdubaVideoState> {
  public state: EdubaVideoState = {
    video: null,
  };

  private removeListener: MainEventUnsubscriber;

  async componentDidMount() {
    this.removeListener = window.ipcEvents.on.VideoChangeEvent(
      async (evt: VideoChangeEvent) => {
        const { props } = this;
        if (
          evt.type !== "delete" &&
          evt.db === props.publisher &&
          evt.id === props.video
        ) {
          const video = await window.ipcSdk.video.load(evt.db, evt.id);
          this.setState({ video });
        }
      }
    );

    const { publisher: publisherId, video: videoId } = this.props;
    const video = await window.ipcSdk.video.load(publisherId, videoId);
    this.setState({ video });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render(props: EdubaVideoProps, state: EdubaVideoState) {
    if (!state.video) return;

    const src = `eduba://${state.video._db}/files/video/${state.video._id}.${state.video.ext}`;

    const videoEl = (
      <video controls>
        <source src={src} type={state.video._type} />
        <a href={src} download>
          Download {state.video.title}
        </a>
      </video>
    );

    const caption = props.caption ? ` - ${props.caption}` : "";

    return (
      <figure>
        {videoEl}
        <figcaption>
          {state.video.title}{caption}
        </figcaption>
      </figure>
    );
  }
}

const observedAttributes: string[] = [];

register(EdubaVideo, "eduba-video", observedAttributes, {
  shadow: false,
});
