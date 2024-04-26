import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { AppStore, PageStore } from "@/renderer/stores";
import { Signal } from "@preact/signals";
import { inject, injectable } from "inversify";
import { createRef } from "preact";

const articleLinkRgx = /^\/?([0-9a-z]{52})\/articles\/([0-9a-z]+)$/i;

export interface ArticleViewerProps {
  class?: string;
  markdown: Signal
}

@injectable()
export class ArticleController extends ComponentController<ArticleViewerProps>{
    public articleRef = createRef();

    constructor(
        @inject(AppStore) private readonly appStore: AppStore,
        @inject(PageStore) private readonly pageStore: PageStore
    ) {
      super();
    }
  
    initialize() {
      this.articleRef.current.addEventListener("click", this.interceptLink);
    }
  
    destroy() {
      this.articleRef.current.removeEventListener("click", this.interceptLink);
    }
  
    interceptLink = async (evt: Event) => {
      try {
        const { target } = evt;

        if (!(target instanceof HTMLElement)) {
            return;
        }
        
        // Return is evt target is not a link.
        if (target.tagName !== "A") return;
  
        let href = target.getAttribute("href");

        // Allow main to handle downloads
        // Must be before startsWith('http') check
        // Because http is used for downloading from hyper
        if (target.hasAttribute("download")) {
          return;
        }
  
        // Force http links to open in the user's default browser
        if (href.startsWith("http")) {
          target.setAttribute("target", "_blank");
          return;
        }
  
        // Prevent default handling of any non-http links
        evt.preventDefault();
  
        if (articleLinkRgx.test(href)) {
          // Open article in same tab
          href = href.startsWith("/") ? href.slice(1) : href;
          this.pageStore.addPage({ href });
          return;
        }
      } catch (err) {
        this.appStore.reportError(err);
      }
    };
  }