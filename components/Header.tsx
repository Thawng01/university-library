import Link from "next/link";
import Image from "next/image";
// import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";

const Header = ({ session }: { session: Session }) => {
    return (
        <header className="my-10 flex justify-between gap-5">
            <Link href="/">
                <Image
                    src="/icons/logo.svg"
                    alt="logo"
                    width={40}
                    height={40}
                />
            </Link>

            <ul className="flex flex-row gap-8">
                <li>
                    <form
                        action={async () => {
                            "use server";

                            await signOut();
                        }}
                        className="mb-10"
                    >
                        <Button>Logout</Button>
                    </form>
                </li>
                <li>
                    <Link href="/my-profile">
                        <Avatar>
                            {/* <AvatarImage src={"https://github/shadcn.png"} /> */}
                            <AvatarFallback>
                                {getInitials(session?.user?.name || "IN")}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;
