"use client";

import type { ReactNode } from "react";

/**
 * Today page content wrapper with soft atmosphere.
 * Does not own scrolling — `#main-content` is the scrollport so sticky headers work.
 * Glow/clouds are absolute and do not create a nested scrollport.
 */
export function TodayPageFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-test="today-page"
      className="today-page-frame relative flex min-h-0 w-full flex-1 flex-col overflow-x-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="today-page-frame__glow absolute inset-0" />
        <div className="today-page-frame__top-fade absolute inset-x-0 top-0 h-[28rem]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--1 absolute -left-28 top-16 h-96 w-[30rem] rounded-[45%]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--2 absolute -right-24 top-24 h-80 w-[22rem] rounded-[40%]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--3 absolute left-[22%] top-48 h-72 w-[24rem] rounded-[50%]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--4 absolute right-[18%] top-[42%] h-64 w-[20rem] rounded-[48%]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--5 absolute left-[8%] top-[68%] h-56 w-[18rem] rounded-[42%]" />
      </div>
      <div
        data-width="full"
        className="suite-page-stage suite-page-inset relative z-[1] flex w-full min-w-0 flex-1 flex-col [&_.list-row]:min-h-[52px] [&_.list-row]:sm:min-h-[44px]"
      >
        {children}
      </div>
    </div>
  );
}
