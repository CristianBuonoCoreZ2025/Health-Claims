"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import {
  getUiStyleSnapshot,
  getUiStyleServerSnapshot,
  subscribeUiStyle,
} from "@/lib/ui-style-client-store";

export function UiStyleInjector() {
  const skin = useSyncExternalStore(
    subscribeUiStyle,
    getUiStyleSnapshot,
    getUiStyleServerSnapshot,
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-ui-style", skin);
  }, [skin]);
  return null;
}
