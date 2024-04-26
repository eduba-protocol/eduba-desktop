import { h, Fragment } from "preact";
import Auth from "./auth/auth";
import Backup from "./backup/backup";
import { useController } from "../../../hooks/use-controller.hook";
import { UserMenuContext, UserMenuController } from "./user-menu.ctrl";
import {
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PlusCircleIcon,
  SignalIcon,
  SignalSlashIcon } from "@heroicons/react/24/solid";
import { useProvider } from "@/renderer/hooks";
import { AuthStore, PublisherStore } from "@/renderer/stores";
import NewPublisher from "./new-publisher/new-publisher";
import TabLink from "@/renderer/components/tab-link";
import { RendererConfig } from "@/renderer/config/config";
import { TYPES } from "@/renderer/di";

export default function UserMenu() {
  const ctrl = useController<never, UserMenuController>(UserMenuController);
  
  const authStore = useProvider<AuthStore>(AuthStore);
  const publisherStore = useProvider<PublisherStore>(PublisherStore);
  const rendererConfig = useProvider<RendererConfig>(TYPES.RendererConfig);

  const sessionActive = authStore.state.sessionActive.value;

  return (
    <UserMenuContext.Provider value={ctrl}>
      <div class="flex-1 flex flex-col justify-between">
        <div>
          {sessionActive && (
          <div class="flex items-center">
            <h2 class="font-bold mr-4 ml-6">My Publishers</h2>
            <button class="btn btn-circle btn-ghost" onClick={ctrl.openNewPublisher}>
              <PlusIcon class="w-6 h-6 text-inherit" />
            </button>
          </div>
          )}
          <ul class="menu w-full rounded-box">
            {ctrl.state.userPublishers.value.map((publisher) => (
              <li class="flex-row">
                <TabLink
                  href={`${publisher._db}/articles/${publisher.article._id}`}
                  class="flex-1"
                >
                  {publisher.article.title}
                </TabLink>
                <div class="dropdown dropdown-bottom dropdown-end">
                  <label tabIndex={0} class="cursor-pointer">
                    <EllipsisVerticalIcon class="w-5 h-5 text-inherit" />
                  </label>
                  <ul
                    tabIndex={0}
                    class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <TabLink
                        pageTitle="New Article"
                        href={`edit/articles/${publisher._db}`}
                        class="join-item mr-4"
                      >
                        <PlusCircleIcon class="w-6 h-6 text-inherit" />
                        Create Article
                      </TabLink>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          publisherStore.togglePublisherPinned(publisher)
                        }
                      >
                        {publisher._pinned ? (
                          <>
                            <SignalIcon class="w-6 h-6 text-inherit" />
                            Serving
                          </>
                        ) : (
                          <>
                            <SignalSlashIcon class="w-6 h-6 text-inherit" />
                            Not Serving
                          </>
                        )}
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ul className="menu w-full rounded-box">
          {rendererConfig.feature.Backup && sessionActive && (
            <li>
              <a onClick={ctrl.openBackup}>Backup / Restore</a>
            </li>
          )}
          {sessionActive && (
            <li>
              <a
                onClick={ctrl.signOut}
                data-testid="sign-out"
              >
                <ArrowRightStartOnRectangleIcon class="w-6 h-6 text-inherit" /> sign
                out
              </a>
            </li>
          )}
        </ul>

        {sessionActive && <NewPublisher onClose={ctrl.closeNewPublisher} />}

        {sessionActive && <Backup onClose={ctrl.closeBackup} />}

        {!sessionActive && <Auth />}
      </div>
    </UserMenuContext.Provider>
  );
}
