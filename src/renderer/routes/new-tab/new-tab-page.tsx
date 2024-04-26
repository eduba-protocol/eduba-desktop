import { h } from "preact";
import { NewTabPageController, NewTabPageProps } from "./new-tab-page.ctrl";
import { useController } from "@/renderer/hooks/use-controller.hook";
import Bookmarks from "./bookmarks/bookmarks";


export default function NewTabPage(props: NewTabPageProps) {
  const ctrl = useController<NewTabPageProps, NewTabPageController>(
    NewTabPageController,
    props,
    [props.pageId]
  );

  return (
    <main class="page w-full max-w-2xl mx-auto" key={props.pageId}>
      <form
        id="new-tab-form"
        class="flex justify-center mt-12"
        {...ctrl.form.elementProps}
      >
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Paste share link</span>
          </label>
          <div class="flex items-center">
            <input
              type="text"
              name="href"
              value={ctrl.form.state.href.value}
              class="input input-bordered w-full invalid:input-error mr-1"
              onInput={ctrl.form.handleInput}
              required
            />
            <button class="btn">Go</button>
          </div>
        </div>
      </form>

      <Bookmarks class="mt-24" />
    </main>
  );
}
