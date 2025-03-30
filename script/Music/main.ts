import fs from 'node:fs'
import path from 'node:path'
import { addToDist } from '../utils.mjs'

const __dirname = import.meta.dirname as string

const apiHost = 'http://localhost:3000'

interface AlbumRawResponse {
  hotAlbums: HotAlbum[]
}

interface HotAlbum {
  name: string
  id: number
  alias: string[]
  picUrl: string
}

interface SimplifiedAlbum {
  publishTime: number
  name: string
  id: number
  alias: string[]
  picUrl: string
}

interface AlbumDetailResponse {
  album: {
    description: string
  }
  songs: Song[]
}

interface Song {
  publishTime: any
  name: string
  id: number
  alia: string[]
  dt: number // duration in milliseconds
}

interface ProcessedAlbum {
  name: string
  id: number
  picUrl: string
  description?: string
  alias?: string
  dt: number // total duration of all songs in milliseconds
  date: number
  songs: SimplifiedSong[]
}

interface SimplifiedSong {
  name: string
  id: number
  alias?: string
  dt: number
}

async function fetchArtistAlbums(): Promise<void> {
  const response = await fetch(`${apiHost}/artist/album?id=12487174&limit=1000`)
  const albumData: AlbumRawResponse = await response.json()

  fs.writeFileSync(
    path.join(__dirname, './data/album_raw.json'),
    JSON.stringify(albumData, null, 2)
  )

  const simplifiedAlbums: SimplifiedAlbum[] = albumData.hotAlbums.map(
    (album) => ({
      name: album.name,
      id: album.id,
      alias: album.alias,
      picUrl: album.picUrl
    })
  )

  fs.writeFileSync(
    path.join(__dirname, './data/album.json'),
    JSON.stringify(simplifiedAlbums, null, 2)
  )

  for (const album of simplifiedAlbums) {
    const response = await fetch(`${apiHost}/album/?limit=1000&id=${album.id}`)
    const albumDetail: AlbumDetailResponse = await response.json()
    console.log(`  正在写入专辑 ${album.id} - ${album.name} 的数据`)

    fs.mkdirSync(path.join(__dirname, './data/album'), { recursive: true })
    fs.writeFileSync(
      path.join(__dirname, 'data', 'album', `${album.id}.json`),
      JSON.stringify(albumDetail, null, 2)
    )
  }
}

async function processSongsData(): Promise<void> {
  let albumIndex = 0
  const processedAlbums: ProcessedAlbum[] = []

  const albumList: SimplifiedAlbum[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, './data/album.json'), 'utf-8')
  )

  for (const album of albumList) {
    const albumWithSongs: ProcessedAlbum = {
      name: album.name,
      id: album.id,
      picUrl: album.picUrl,
      alias: album.alias[0],
      date: album.publishTime,
      dt: 0,
      songs: []
    }

    const rawAlbumData: string = fs.readFileSync(
      path.join(__dirname, 'data', 'album', `${album.id}.json`),
      'utf-8'
    )
    const albumDetail: AlbumDetailResponse = JSON.parse(rawAlbumData)

    albumWithSongs.description = albumDetail.album.description

    let totalDuration = 0
    for (const song of albumDetail.songs) {
      albumWithSongs.songs.push({
        name: song.name,
        id: song.id,
        alias: song.alia.length ? song.alia[0] : undefined,
        dt: song.dt
      })
      totalDuration += song.dt
    }

    albumWithSongs.dt = totalDuration
    processedAlbums.push(albumWithSongs)
    albumIndex++
  }

  addToDist('song_meta', JSON.stringify(processedAlbums))

  fs.writeFileSync(
    path.join(__dirname, './data/songs.json'),
    JSON.stringify(processedAlbums, null, 2)
  )
}

// Ensure data directory exists
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true })

console.log(`Music - 开始`)
// await fetchArtistAlbums()
console.log(`Music - 专辑信息获取已完成`)
await processSongsData()
console.log(`Music - 基础信息已完成`)
