const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai")
const axios = require("axios")

const app = express()
const port = process.env.PORT || 5000

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("AI Mood-Based Playlist Generator Backend is running!")
})

app.post("/api/mood", async (req, res) => {
  try {
    const { moodDescription } = req.body
    if (!moodDescription) {
      return res.status(400).json({ error: "Mood description is required." })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const prompt = `Interpret the mood into a comma-separated list of tags. Mood: "${moodDescription}"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const moodTags = text.split(",").map(tag => tag.trim())

    res.json({ moodTags })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to process mood with AI." })
  }
})

let spotifyToken = ""
let tokenExpiry = 0

async function getSpotifyToken() {
  if (spotifyToken && Date.now() < tokenExpiry) {
    return spotifyToken
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env
  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    spotifyToken = response.data.access_token
    tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000
    return spotifyToken
  } catch (error) {
    console.error(error.response ? error.response.data : error.message)
    throw new Error("Failed to get Spotify token")
  }
}

app.post("/api/playlist", async (req, res) => {
  try {
    const { moodTags } = req.body
    if (!moodTags || moodTags.length === 0) {
      return res.status(400).json({ error: "Mood tags are required." })
    }

    const token = await getSpotifyToken()
    const query = moodTags.join(" ")

    const searchResponse = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: "playlist", limit: 10 },
    })

    const playlists = searchResponse.data.playlists.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images[0] ? playlist.images[0].url : null,
      externalUrl: playlist.external_urls.spotify,
      tracksUrl: playlist.tracks.href,
    }))

    res.json({ playlists })
  } catch (error) {
    console.error(error.response ? error.response.data : error.message)
    res.status(500).json({ error: "Failed to fetch Spotify playlist." })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
