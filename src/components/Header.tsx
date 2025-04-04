import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold mr-6">
          masxflix
        </Link>
        {/* Navigation links */}
        <nav>
          <Link href="/search" className="mr-4 hover:text-gray-300">
            Search
          </Link>
          {/* Add other links like Watchlist, etc. later */}
        </nav>
      </div>
      <div>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
} 