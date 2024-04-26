import register from "preact-custom-element";
import { Component, h } from "preact";
import { UploadDto } from "@/dtos/response/interfaces";
import { MainEventUnsubscriber } from "@/api/ipc/types";
import { UploadChangeEvent } from "@/events/common/main";

interface EdubaUploadProps {
  publisher: string;
  upload: string;
}

interface EdubaUploadState {
  upload: UploadDto | null;
}

export class EdubaUpload extends Component<EdubaUploadProps, EdubaUploadState> {
  public state: EdubaUploadState = {
    upload: null,
  };

  private removeListener: MainEventUnsubscriber;

  async componentDidMount() {
    this.removeListener = window.ipcEvents.on.UploadChangeEvent(
      async (evt: UploadChangeEvent) => {
        const { props } = this;
        if (evt.db === props.publisher && evt.id === props.upload) {
          const upload = await window.ipcSdk.upload.get(evt.db, evt.id);
          this.setState({ upload });
        }
      }
    );

    const { publisher: publisherId, upload: uploadId } = this.props;
    const upload = await window.ipcSdk.upload.get(publisherId, uploadId);
    this.setState({ upload });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render(props: EdubaUploadProps, state: EdubaUploadState) {
    const { upload } = state;

    if (!upload) return;

    const ext = upload.ext ? `.${upload.ext}` : "";

    return (
      <a
        class="btn"
        href={`eduba/${upload._db}/files/uploads/${upload._id}${ext}`}
        download={`${upload.fileName}${ext}`}
      >
        Download {upload.fileName}{ext}
      </a>
    );
  }
}

const observedAttributes: string[] = [];

register(EdubaUpload, "eduba-upload", observedAttributes, {
  shadow: false,
});
