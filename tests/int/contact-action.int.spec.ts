import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendMailMock, createTransportMock } = vi.hoisted(() => ({
  sendMailMock: vi.fn(),
  createTransportMock: vi.fn(),
}))

vi.mock('nodemailer', () => ({
  default: {
    createTransport: createTransportMock,
  },
}))

import { sendContact } from '@/app/actions/contact'

describe('sendContact', () => {
  beforeEach(() => {
    sendMailMock.mockReset()
    createTransportMock.mockReset()
    createTransportMock.mockReturnValue({ sendMail: sendMailMock })
    process.env.SMTP_HOST = 'localhost'
    process.env.SMTP_PORT = '1025'
    process.env.SMTP_USER = 'test'
    process.env.SMTP_PASS = 'test'
    process.env.CONTACT_TO_EMAIL = 'hello@example.com'
  })

  it('returns an error for invalid data', async () => {
    const formData = new FormData()
    formData.set('name', '')
    formData.set('email', 'not-an-email')
    formData.set('subject', '')
    formData.set('message', '')

    const result = await sendContact(null, formData)

    expect(result).toEqual({ success: false, error: 'Please fill in all fields correctly.' })
    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it('omits SMTP auth when credentials are not configured', async () => {
    process.env.SMTP_USER = ''
    process.env.SMTP_PASS = ''

    const formData = new FormData()
    formData.set('name', 'Ada')
    formData.set('email', 'ada@example.com')
    formData.set('subject', 'Hello')
    formData.set('message', 'Hi there')

    await sendContact(null, formData)

    expect(createTransportMock).toHaveBeenCalledWith(
      expect.not.objectContaining({
        auth: expect.anything(),
      }),
    )
  })

  it('sends an email for valid data', async () => {
    const formData = new FormData()
    formData.set('name', 'Ada')
    formData.set('email', 'ada@example.com')
    formData.set('subject', 'Hello')
    formData.set('message', 'Hi there')

    const result = await sendContact(null, formData)

    expect(result).toEqual({ success: true })
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'hello@example.com',
      }),
    )
  })
})
