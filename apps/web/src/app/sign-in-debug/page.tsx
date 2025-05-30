'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Info, AlertCircle } from 'lucide-react'

export default function SignInDebugPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  interface EnvData {
    environment?: {
      NODE_ENV?: string
      AUTH_SECRET?: string
      NEXTAUTH_SECRET?: string
      AUTH_ISSUER?: string
    }
    cookieName?: string
    cookieValue?: string
  }
  const [env, setEnv] = useState<EnvData | null>(null)

  useEffect(() => {
    // Fetch environment information
    fetch('/api/auth/environment')
      .then((res) => res.json())
      .then((data) => setEnv(data))
      .catch((err) => setError('Failed to load environment data: ' + err.message))
  }, [])

  const handleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Starting sign-in process...')

      // Log environment before sign-in
      console.log('Environment before sign-in:', {
        callbackUrl: window.location.origin + '/auth-debug',
        currentUrl: window.location.href,
        origin: window.location.origin,
      })

      // Attempt sign-in
      const result = await signIn('dex', {
        callbackUrl: window.location.origin + '/auth-debug',
        redirect: true,
      })

      console.log('Sign-in result:', result)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
        console.error('Sign-in error:', err)
      } else {
        setError('An unknown error occurred')
        console.error('Sign-in error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Sign In Debug</h1>

      {error && (
        <Alert variant='destructive' className='mb-4'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>Try signing in with different options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Button onClick={handleSignIn} disabled={loading} className='w-full'>
                {loading ? 'Signing in...' : 'Sign in with Dex'}
              </Button>

              <Alert>
                <Info className='h-4 w-4' />
                <AlertTitle>Debug Mode</AlertTitle>
                <AlertDescription>
                  This will redirect you to the Dex identity provider and back to the auth-debug page.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
            <CardDescription>Authentication configuration details</CardDescription>
          </CardHeader>
          <CardContent>
            {env ? (
              <Tabs defaultValue='env'>
                <TabsList className='mb-2'>
                  <TabsTrigger value='env'>Environment</TabsTrigger>
                  <TabsTrigger value='cookies'>Cookies</TabsTrigger>
                </TabsList>
                <TabsContent value='env'>
                  <div className='text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                    <p>
                      NODE_ENV: <span className='font-mono'>{env.environment?.NODE_ENV || 'Not set'}</span>
                    </p>
                    <p>AUTH_SECRET: {env.environment?.AUTH_SECRET || 'Not set'}</p>
                    <p>NEXTAUTH_SECRET: {env.environment?.NEXTAUTH_SECRET || 'Not set'}</p>
                    <p>
                      AUTH_ISSUER: <span className='font-mono'>{env.environment?.AUTH_ISSUER || 'Not set'}</span>
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value='cookies'>
                  <div className='text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                    {env.cookieName ? (
                      <>
                        <p>
                          Cookie found: <span className='font-mono'>{env.cookieName}</span>
                        </p>
                        <p>
                          Value: <span className='font-mono truncate'>{env.cookieValue?.substring(0, 20)}...</span>
                        </p>
                      </>
                    ) : (
                      <p>No session cookie found</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className='text-sm'>Loading environment data...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
