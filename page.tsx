"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import PlaylistCard from "@/components/playlist-card"

type Playlist = {
  id: string
  name: string
  description: string
  imageUrl: string | null
  externalUrl: string
}

export default function PlaylistPage() {
  const searchParams = useSearchParams()
  const moodTags = searchParams.get("moodTags")
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function getPlaylists() {
      if (!moodTags) {
        setError("No mood selected")
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/playlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moodTags: moodTags.split(",") }),
        })

        if (!res.ok) {
          throw new Error("Could not load playlists")
        }

        const data = await res.json()
        setPlaylists(data.playlists)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    getPlaylists()
  }, [moodTags])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 p-6 container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Playlists for: {moodTags?.split(",").join(", ")}
        </h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && playlists.length === 0 && (
          <p className="text-center">No playlists found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              name={playlist.name}
              description={playlist.description}
              imageUrl={playlist.imageUrl}
              externalUrl={playlist.externalUrl}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
