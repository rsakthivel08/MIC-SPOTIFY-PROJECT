import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-balance">
        AI Mood Playlist
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/playlist" className="hover:underline">
              Playlist
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
