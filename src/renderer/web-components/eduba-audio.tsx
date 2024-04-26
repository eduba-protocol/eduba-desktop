import register from "preact-custom-element";
import { Component, h } from "preact";
import { AudioDto } from "@/dtos/response/interfaces";
import { MainEventUnsubscriber } from "@/api/ipc/types";
import { AudioChangeEvent } from "@/events/common/main";

interface EdubaAudioProps {
  publisher: string;
  audio: string;
  caption?: string;
}

interface EdubaAudioState {
  audio: AudioDto | null;
}

export class EdubaAudio extends Component<EdubaAudioProps, EdubaAudioState> {
  public state: EdubaAudioState = {
    audio: null,
  };

  private removeListener: MainEventUnsubscriber;

  async componentDidMount() {
    this.removeListener = window.ipcEvents.on.AudioChangeEvent(
      async (evt: AudioChangeEvent) => {
        const { props } = this;
        if (
          evt.type !== "delete" &&
          evt.db === props.publisher &&
          evt.id === props.audio
        ) {
          const audio = await window.ipcSdk.audio.load(evt.db, evt.id);
          this.setState({ audio });
        }
      }
    );

    const { publisher: publisherId, audio: audioId } = this.props;
    const audio = await window.ipcSdk.audio.load(publisherId, audioId);
    this.setState({ audio });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render(props: EdubaAudioProps, state: EdubaAudioState) {
    if (!state.audio) return;

    const src = `eduba://${state.audio._db}/files/audio/${state.audio._id}.${state.audio.ext}`;

    const audioEl = (
      <audio controls>
        <source src={src} type={state.audio._type} />
        <a href={src} download>
          Download {state.audio.title}
        </a>
      </audio>
    );

    const caption = props.caption ? ` - ${props.caption}` : "";

    return (
      <figure>
        {audioEl}
        <figcaption>
          {state.audio.title}{caption}
        </figcaption>
      </figure>
    );
  }
}

const observedAttributes: string[] = [];

register(EdubaAudio, "eduba-audio", observedAttributes, {
  shadow: false,
});
