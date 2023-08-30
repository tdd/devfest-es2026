import type { NavOperations, ShortcutOptions } from "@slidev/types";

import { defineShortcutsSetup } from "@slidev/types";

export default defineShortcutsSetup(
  (nav: NavOperations, base: ShortcutOptions[]) => {
    console.log(base);
    return [
      ...base, // keep the existing shortcuts
      {
        key: "Home",
        fn: () => nav.goFirst(),
      },
      {
        key: "Meta+ArrowUp",
        fn: () => nav.goFirst(),
      },
      {
        key: "End",
        fn: () => nav.goLast(),
      },
      {
        key: "Meta+ArrowDown",
        fn: () => nav.goLast(),
      },
    ];
  }
);
