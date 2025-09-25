import Image from "next/image"
import Link from "next/link"

type PlaylistCardProps = {
  name: string
  description: string
  imageUrl: string | null
  externalUrl: string
}

export default function PlaylistCard({ name, description, imageUrl, externalUrl }: PlaylistCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-t-lg">
            No Image
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-balance">{name}</h3>
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        </div>
        <Link
          href={externalUrl}
          target="_blank"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
        >
          Open in Spotify
        </Link>
      </div>
    </div>
  )
}
