"use client";

import type { XraBootTask } from "./types";

const tasks: XraBootTask[] = [];

export function registerXraBootTask(task: XraBootTask) {
  if (tasks.some((t) => t.id === task.id)) return;
  tasks.push(task);
}

export function getXraBootTasks() {
  return tasks.slice();
}

