import Link from "next/link";
import Image from "next/image";

import { cn } from "~/lib/utils";
import { headingFont } from "~/lib/fonts";

export function Logo() {
  return (
    <Link href="/">
      <div className="hidden items-center gap-x-2 transition hover:opacity-75 md:flex">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <p
          className={cn("pt-1 text-lg text-neutral-700", headingFont.className)}
        >
          EZFlow
        </p>
      </div>
    </Link>
  );
}
