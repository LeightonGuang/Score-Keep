import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <Link
          href="/chess-clock"
          className="rounded-md bg-red-500 p-2 text-green-500"
        >
          Chess Clock
        </Link>
      </main>
    </div>
  );
}
