import Link from "next/link";
import UserButton from "../UserButton";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 shadow-md rounded-b-lg">
      <h1 className="text-2xl font-bold">Sta. Clara</h1>
      <nav className="flex items-center gap-4">
        <Link href="/secret-1">Secret 1</Link>
        <Link href="/secret-2">Secret 2</Link>
        <Link href="/secret-3">Secret 3</Link>
        <UserButton />
      </nav>
    </header>
  );
}
