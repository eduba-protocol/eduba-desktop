import { h } from "preact";
import TabLink from "@/renderer/components/tab-link";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { SubscriptionsController } from "./subscriptions.ctrl";

export default function Subscriptions() {
  const ctrl = useController<never, SubscriptionsController>(
    SubscriptionsController
  );

  return (
    <div>
      <h2 class="font-bold ml-6">Subscriptions</h2>
      <ul class="menu w-full rounded-box">
        {ctrl.state.subscribedPublishers.value.map((publisher) => (
          <li>
            <TabLink
              href={`${publisher._db}/articles/${publisher.article._id}`}
              class="flex-1"
            >
              {publisher.article.title}
            </TabLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
