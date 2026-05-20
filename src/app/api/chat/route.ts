import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

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
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const groq = new Groq({ apiKey })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}