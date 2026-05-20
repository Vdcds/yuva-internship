import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const DEPARTMENTS = ['Revenue', 'Land Records', 'Municipal', 'Health', 'Education', 'Business', 'Transport', 'Utilities', 'Legal Services']
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

const SYSTEM_PROMPT = `You are an AI assistant for an E-Governance Portal. Your role is to help citizens navigate government services in India. You are knowledgeable, helpful, and courteous.

The portal offers these services:
- Service Requests: Citizens can submit requests for Transport (driving license, vehicle registration), Legal (marriage certificates, building approvals), Tax (property tax payments), Utilities (water/electricity connections), Documents (passport, income certificates), Business (trade licenses), Land Records, Health, and Education services.
- Appointments: Citizens can book appointments with government departments.
- Document tracking: Citizens can track and manage their documents.

Available departments: ${DEPARTMENTS.join(', ')}
Available time slots: ${TIME_SLOTS.join(', ')}
Available request statuses: PENDING, APPROVED, REJECTED
Appointment statuses: SCHEDULED, COMPLETED, CANCELLED

Guidelines:
- Be concise and helpful
- Guide users on how to use the portal features
- When a user wants to book an appointment, collect the department, date, time slot, and optional notes. Use the book_appointment tool to create the appointment.
- Always confirm the details with the user before booking
- Do not make up specific case details or tracking numbers
- If asked about topics unrelated to e-governance or the portal, politely redirect`

const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description: 'Book an appointment with a government department for a citizen',
      parameters: {
        type: 'object',
        properties: {
          department: {
            type: 'string',
            enum: DEPARTMENTS,
            description: 'The government department for the appointment',
          },
          date: {
            type: 'string',
            description: 'Date for the appointment in YYYY-MM-DD format',
          },
          timeSlot: {
            type: 'string',
            enum: TIME_SLOTS,
            description: 'Time slot for the appointment',
          },
          notes: {
            type: 'string',
            description: 'Optional notes for the appointment',
          },
        },
        required: ['department', 'date', 'timeSlot'],
      },
    },
  },
]

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

    const apiMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: apiMessages,
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 1024,
    })

    const choice = completion.choices[0]
    const message = choice.message

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0]

      if (toolCall.function.name === 'book_appointment') {
        const args = JSON.parse(toolCall.function.arguments)
        const user = await getCurrentUser()

        if (!user) {
          return NextResponse.json({
            message: 'You need to be logged in to book an appointment. Please sign in first.',
          })
        }

        const { department, date, timeSlot, notes } = args

        const appointment = await prisma.appointment.create({
          data: {
            department,
            date: new Date(date),
            timeSlot,
            notes: notes || null,
            userId: user.id,
            status: 'SCHEDULED',
          },
        })

        return NextResponse.json({
          message: `Your appointment has been booked successfully! Here are the details:\n\n• **Department:** ${department}\n• **Date:** ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n• **Time:** ${timeSlot}${notes ? `\n• **Notes:** ${notes}` : ''}\n\nYou can view this appointment in the Appointments section of your dashboard.`,
          appointmentBooked: true,
          appointment: {
            id: appointment.id,
            department: appointment.department,
            date: appointment.date,
            timeSlot: appointment.timeSlot,
          },
        })
      }
    }

    const response = message.content || 'Sorry, I could not generate a response.'
    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}