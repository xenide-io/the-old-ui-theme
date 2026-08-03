'use client';

import type { ReactNode } from 'react';

/** Full-bleed theme wash + soft clouds; uses ph-* tokens from each app's theme. */
export function TodayPageFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-test="today-page"
      className="today-page-frame relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] overflow-hidden"
        aria-hidden
      >
        <div className="today-page-frame__glow absolute inset-0" />
        <div className="today-page-frame__sun absolute -right-16 -top-16 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 via-rose-300/20 to-rose-400/10 blur-3xl opacity-60 motion-safe:animate-[pulse_8s_ease-in-out_infinite] motion-reduce:opacity-40" />
        <div className="today-page-frame__top-fade absolute inset-x-0 top-0 h-64" />
        <div className="today-page-frame__cloud today-page-frame__cloud--1 absolute -left-24 top-28 h-80 w-[26rem] rounded-[45%]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--2 absolute -right-20 top-40 h-72 w-80 rounded-[40%]" />
        <div className="today-page-frame__cloud today-page-frame__cloud--3 absolute left-[28%] top-[58%] h-64 w-[22rem] rounded-[50%]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8 [&_.list-row]:min-h-[52px] [&_.list-row]:sm:min-h-[44px]">
        {children}
      </div>
    </div>
  );
}
