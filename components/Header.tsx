import Image from "next/image";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import CustomSignInButton from "./CustomSignInButton";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-14">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/images/pomosgarden-logo.png"
          alt="Pomo's Garden logo"
          width={62}
          height={62}
        />
        <span className="mt-1.5 font-medium leading-4 text-zinc-900">
          Pomo&apos;s
          <br />
          Garden
        </span>
      </Link>
      <div>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-12 h-12",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
