import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link href={"/"}>
					<div className="flex items-center space-x-2">
						<div className="h-8 w-8 rounded-lg bg-[#6e40f7]"></div>
						<span className="text-xl font-bold text-foreground">
							AI FormBuilder
						</span>
					</div>
				</Link>

				<nav className="hidden md:flex items-center space-x-8">
					<Link
						href="/"
						className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Home
					</Link>

					<Link
						href="/create-form"
						className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Create Form
					</Link>
					<SignedIn>
						<Link
							href="/dashboard"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
							Dashboard
						</Link>
					</SignedIn>
				</nav>

				<div className="flex items-center space-x-4">
					<SignedIn>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<Button
							asChild
							className="rounded-lg brand-bg hover:bg-[#845fff]/90  text-white">
							<Link href="/sign-in">Start For Free</Link>
						</Button>
					</SignedOut>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
};

export default Header;
