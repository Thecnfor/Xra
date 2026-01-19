"use client";

import dynamic from "next/dynamic";
import React from "react";

/**
 * NoSSR 组件
 *
 * 用于包裹不需要在服务端渲染的组件。
 * 被包裹的内容只会在客户端挂载后渲染。
 *
 * @example
 * <NoSSR>
 *   <HeavyComponent />
 * </NoSSR>
 */
const NoSSR = dynamic(
  () =>
    Promise.resolve((props: { children: React.ReactNode }) => (
      <>{props.children}</>
    )),
  {
    ssr: false,
  },
);

export default NoSSR;
