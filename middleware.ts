import { useWallet } from "@mintbase-js/react";
import { NextResponse } from "next/server";
import { env } from "~/env.mjs";

export default function middleware(req: { url: string | string[] }) {
  const { activeAccountId } = useWallet();
  let verify = activeAccountId == env.NEXT_PUBLIC_OWNER;
  console.log(verify);

  if (!verify && req.url.includes("/create")) {
    return NextResponse.redirect("/");
  }
  // if(verify) return NextResponse.redirect
}
