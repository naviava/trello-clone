import Link from "next/link";

import { Medal } from "lucide-react";

import { Button } from "~/components/ui/button";

import { cn } from "~/lib/utils";
import { headingFont, textFont } from "~/lib/fonts";

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          headingFont.className,
        )}
      >
        <div className="mb-4 flex items-center rounded-full border bg-amber-100 p-4 uppercase text-amber-700 shadow-sm">
          <Medal className="mr-2 h-6 w-6" />
          No 1 Task Management
        </div>
        <h1 className="mb-6 text-center text-3xl text-neutral-800 md:text-6xl">
          Taskify helps teams move
        </h1>
      </div>
      <div className="w-fit rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 p-2 px-4 pb-4 text-3xl text-white md:text-6xl">
        work forward.
      </div>
      <div
        className={cn(
          "mx-auto mt-4 max-w-xs text-center text-sm text-neutral-400 md:max-w-2xl md:text-xl",
          textFont.className,
        )}
      >
        Enhance your team&apos;s performance in any setting, from high-rises to
        home offices, with Taskify. Streamline collaboration, project
        management, and achieve new levels of productivity. Maximize your
        team&apos;s potential with Taskify.
      </div>
      <Button size="lg" asChild className="mt-6">
        <Link href="sign-up">Get Taskify for Free</Link>
      </Button>
    </div>
  );
}
