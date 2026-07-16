'use server'

import nodemailer from 'nodemailer'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
})

export async function sendContact(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    return { success: false, error: 'Please fill in all fields correctly.' }
  }

  const { name, email, subject, message } = parsed.data
  const smtpHost = process.env.SMTP_HOST?.trim() || 'localhost'
  const smtpPort = Number(process.env.SMTP_PORT ?? '1025')
  const smtpUser = process.env.SMTP_USER?.trim()
  const smtpPass = process.env.SMTP_PASS?.trim()
  const contactToEmail = process.env.CONTACT_TO_EMAIL?.trim() || 'pamdesp@gmail.com'

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number.isNaN(smtpPort) ? 1025 : smtpPort,
    secure: false,
    ...(smtpUser || smtpPass
      ? {
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        }
      : {}),
  })

  await transporter.sendMail({
    from: `"${name}" <${smtpUser || 'no-reply@localhost'}>`,
    to: contactToEmail,
    replyTo: email,
    subject: `[pamgnn contact] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  return { success: true }
}
