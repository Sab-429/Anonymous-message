'use client'

import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ApiResponse } from '@/src/types/ApiResponse'

interface PublicProfileResponse {
  success: boolean
  message?: string
  isAcceptingMessages?: boolean
}

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string }>()
  const [content, setContent] = useState('')
  const [email, setemail] = useState('')
  const [loading, setLoading] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!username) return
    const fetchProfile = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `/api/public-profile?username=${username}`
        )

        if (!res.data.success) {
          toast.error(res.data.message || 'User not found')
          return
        }

        setAccepting(res.data.isAcceptingMessages ?? false)
      } catch (error) {
        toast.error('Failed to load profile')
      }
    }

    fetchProfile()
  }, [username])

  const handleSendMessage = async () => {
    if (!email.trim() || !content.trim()) {
      toast.error('Email and message are required')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post('/api/send-message', {
        username,
        content,
        email,
      })

      if (res.data.success) {
        toast.success('Message sent anonymously')
        setemail('')
        setContent('')
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast.error(
        axiosError.response?.data.message || 'Failed to send message'
      )
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('/api/suggest-message')

      if (res.data.success && Array.isArray(res.data.suggestions)) {
        setSuggestions(res.data.suggestions)
      } else {
        toast.error('No suggestions available')
      }
    } catch {
      toast.error('Failed to load suggestions')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-xl bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Send an anonymous message
        </h1>

        <p className="text-center text-muted-foreground mb-6">
          to <span className="font-semibold">@{username}</span>
        </p>

        {!accepting ? (
          <p className="text-center text-red-500">
            This user is not accepting messages.
          </p>
        ) : (
          <>
            <input
              type='email'
              placeholder='Enter Your email'
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className='w-full mb-4 border rounded px-3 py-2'
            />
            <Textarea
              placeholder="Write your anonymous message here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="mb-4"
            />

            <Button
              onClick={handleSendMessage}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>

            <Separator className="my-6" />

            <Button
              variant="outline"
              onClick={fetchSuggestions}
              className="w-full mb-4"
            >
              Get suggested messages
            </Button>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="cursor-pointer rounded border p-3 hover:bg-muted"
                    onClick={() => setContent(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PublicProfilePage
