// src/app/SessionWrapper.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

export default function SessionWrapper({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
