import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'markers.json')

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath)
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
    await fs.writeFile(dataFilePath, '[]')
  }
}

export async function GET() {
  await ensureDataFile()
  const data = await fs.readFile(dataFilePath, 'utf8')
  return NextResponse.json(JSON.parse(data))
}

export async function POST(request) {
  const marker = await request.json()
  await ensureDataFile()
  
  const data = await fs.readFile(dataFilePath, 'utf8')
  const markers = JSON.parse(data)
  markers.push(marker)
  
  await fs.writeFile(dataFilePath, JSON.stringify(markers, null, 2))
  return NextResponse.json(marker)
}

export async function DELETE(request) {
  const { id } = await request.json()
  await ensureDataFile()
  
  const data = await fs.readFile(dataFilePath, 'utf8')
  const markers = JSON.parse(data)
  const filteredMarkers = markers.filter(marker => marker.id !== id)
  
  await fs.writeFile(dataFilePath, JSON.stringify(filteredMarkers, null, 2))
  return NextResponse.json({ success: true })
}
