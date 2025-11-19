import Link from "next/link";
import UserButton from "../UserButton";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 shadow-md rounded-b-lg">
      <h1 className="text-2xl font-bold">Sta. Clara</h1>
      <nav className="flex items-center gap-4">
        <UserButton />
      </nav>
    </header>
  );
}
