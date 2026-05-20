import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are an AI assistant for an E-Governance Portal. Your role is to help citizens navigate government services in India. You are knowledgeable, helpful, and courteous.

The portal offers these services:
- Service Requests: Citizens can submit requests for Transport (driving license, vehicle registration), Legal (marriage certificates, building approvals), Tax (property tax payments), Utilities (water/electricity connections), Documents (passport, income certificates), Business (trade licenses), Land Records, Health, and Education services.
- Appointments: Citizens can book appointments with government departments.
- Document tracking: Citizens can track and manage their documents.

Available request statuses: PENDING, APPROVED, REJECTED
Appointment statuses: SCHEDULED, COMPLETED, CANCELLED
Priority levels: HIGH (Transport, Legal, Health), MEDIUM (Tax, Utilities, Education, Business, Land Records), LOW (Documents, Other)

Guidelines:
- Be concise and helpful
- Guide users on how to use the portal features
- Explain government service processes clearly
- Suggest appropriate categories for requests
- Do not make up specific case details or tracking numbers
- If asked about topics unrelated to e-governance or the portal, politely redirect
- Always respond in English unless the user writes in another language, then respond in that language`

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am an AI assistant for the E-Governance Portal. I will help citizens with government services, portal navigation, and process guidance. How can I help you today?' }] },
        ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ],
    })

    const lastMessage = messages[messages.length - 1]?.content || ''
    const result = await chat.sendMessage(lastMessage)
    const response = result.response.text()

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}