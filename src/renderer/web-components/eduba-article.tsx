import register from "preact-custom-element";
import { Component, h } from "preact";
import { ArticleDto } from "@/dtos/response/interfaces";
import { MainEventUnsubscriber } from "@/api/ipc/types";
import { ArticleChangeEvent } from "@/events/common/main";

interface EdubaArticleProps {
  publisher: string;
  article: string;
  caption?: string;
  label?: string;
}

export interface EdubaArticleState {
  article: ArticleDto | null;
}

export class EdubaArticle extends Component<EdubaArticleProps, EdubaArticleState> {
  public state: EdubaArticleState = {
    article: null,
  };

  private removeListener: MainEventUnsubscriber;

  async componentDidMount() {
    this.removeListener = window.ipcEvents.on.ArticleChangeEvent(
      async (evt: ArticleChangeEvent) => {
        const { props } = this;
        if (evt.db === props.publisher && evt.id === props.article) {
          const article = await window.ipcSdk.article.load(evt.db, evt.id);
          this.setState({ article });
        }
      }
    );

    const { publisher: publisherId, article: articleId } = this.props;
    const article = await window.ipcSdk.article.load(publisherId, articleId);
    this.setState({ article });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render(props: EdubaArticleProps, state: EdubaArticleState) {
    const label = props.label || (state.article && state.article.title);
    return <a href={`${props.publisher}/articles/${props.article}`}>{label}</a>;
  }
}

const observedAttributes: string[] = [];

register(EdubaArticle, "eduba-article", observedAttributes, {
  shadow: false,
});
