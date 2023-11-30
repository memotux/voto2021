import { USkeleton } from "#components";
import { plot } from "@observablehq/plot";

export default defineComponent({
  name: 'Plot',
  props: ["options"],
  render() {
    const { options } = this;
    return withDirectives(h("div", [h(USkeleton, { class: 'w-[640px] h-[400px]', ui: { background: 'bg-blue-100/75 dark:bg-blue-800/25' } })]), [
      [
        (el) => {
          el.replaceChildren(plot(options));
        }
      ]
    ]);
  }
})