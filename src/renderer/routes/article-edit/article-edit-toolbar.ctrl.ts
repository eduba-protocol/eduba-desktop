import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { signalState } from "@/lib/signal-state";
import { injectable } from "inversify";

export enum ArticleEditTool {
  Audio = "Audio",
  Image = "Image",
  Link = "Link",
  Upload = "Upload",
  Video = "Video"
}

export interface ArticleEditToolbarProps {
  onInsert: (text: string) => void;
  dbId?: string;
}

export interface ArticleEditToolbarState {
  tool: ArticleEditTool | null;
}

@injectable()
export class ArticleEditToolbarController extends ComponentController<ArticleEditToolbarProps> {
  public state = signalState<ArticleEditToolbarState>({ tool: null });
  
  openTool = (evt: Event) => {
    if (evt.currentTarget instanceof HTMLButtonElement) {
        const { tool } = evt.currentTarget.dataset;
        this.state._set({ tool });
    }
  }

  handleToolDone = (text: string) => {
    this.state._set({ tool: null });

    if (text) {
      this.props.onInsert(text);
    }
  }
}