'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/shadcn/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/shadcn/alert'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Info, AlertCircle, CheckCircle, Clock } from 'lucide-react'

// Define interfaces for auth data
interface DecodedToken {
  exp?: number
  iat?: number
  sub?: string
  email?: string
  name?: string
  [key: string]: string | number | boolean | undefined
}

interface TokenData {
  tokenExists: boolean
  expirationTime?: string
  currentTime?: string
  isExpired?: boolean
  timeUntilExpiry?: number
  decodedToken?: DecodedToken
  token?: {
    accessToken?: string
    [key: string]: unknown
  }
  error?: string
}

interface EnvironmentData {
  tokenExists?: boolean
  cookieName?: string
  cookieValue?: string
  environment?: {
    AUTH_SECRET?: string
    NEXTAUTH_SECRET?: string
    AUTH_ISSUER?: string
    NODE_ENV?: string
    [key: string]: string | undefined
  }
  error?: string
  details?: string
}

export default function AuthDebugPage() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [envData, setEnvData] = useState<EnvironmentData | null>(null)
  const [loading, setLoading] = useState<{ token: boolean; env: boolean }>({ token: false, env: false })
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchTokenData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, token: true }))
    setError(null)
    try {
      const response = await fetch('/api/auth/debug')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Token API error response:', response.status, errorData)
        setTokenData({
          tokenExists: false,
          error: `Failed to fetch token data: ${response.status} ${response.statusText}`,
        })
        return
      }

      const data = await response.json()
      console.log('Token data received:', data)
      setTokenData(data)
    } catch (err) {
      setTokenData({
        tokenExists: false,
        error: 'Failed to fetch token data: Network error',
      })
      console.error('Error fetching token data:', err)
    } finally {
      setLoading((prev) => ({ ...prev, token: false }))
    }
  }, [])

  const fetchEnvData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, env: true }))
    try {
      const response = await fetch('/api/auth/environment')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Environment API error response:', response.status, errorData)
        setEnvData({
          error: `Failed to fetch environment data: ${response.status} ${response.statusText}`,
        })
        return
      }

      const data = await response.json()
      console.log('Environment data received:', data)

      if (!data) {
        console.error('Environment data is null or undefined')
        setEnvData({
          error: 'Received empty response from environment API',
        })
        return
      }

      setEnvData(data)

      if (data.error) {
        setError(`Environment API error: ${data.error}`)
      }
    } catch (err) {
      setEnvData({
        error: 'Failed to fetch environment data: Network error',
      })
      console.error('Error fetching environment data:', err)
    } finally {
      setLoading((prev) => ({ ...prev, env: false }))
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchTokenData()
    fetchEnvData()
  }, [fetchTokenData, fetchEnvData])

  useEffect(() => {
    refreshData()

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData()
      }, 10000) // Refresh every 10 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [autoRefresh, refreshData])

  const formatTime = (ms: number) => {
    if (ms < 0) return 'Expired'

    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

    return `${hours}h ${minutes}m ${seconds}s`
  }

  const formatTokenStatus = () => {
    if (!tokenData) return { color: 'gray', text: 'Unknown', icon: Info }
    if (tokenData.error) return { color: 'yellow', text: 'Error', icon: AlertCircle }
    if (!tokenData.tokenExists) return { color: 'red', text: 'Missing', icon: AlertCircle }
    if (tokenData.isExpired) return { color: 'red', text: 'Expired', icon: AlertCircle }

    return { color: 'green', text: 'Valid', icon: CheckCircle }
  }

  const tokenStatus = formatTokenStatus()

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Auth Debug Dashboard</h1>
          <div className='flex gap-2 items-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-blue-100 dark:bg-blue-900' : ''}
            >
              <Clock className='w-4 h-4 mr-2' />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Button>
            <Button onClick={refreshData} disabled={loading.token || loading.env}>
              Refresh All
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant='destructive' className='my-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Token Status Card */}
          <Card>
            <CardHeader className='pb-2'>
              <div className='flex justify-between'>
                <div>
                  <CardTitle>Token Status</CardTitle>
                  <CardDescription>Authentication token information</CardDescription>
                </div>
                <div
                  className={`px-3 py-1 rounded-md text-white flex items-center ${
                    tokenStatus.color === 'green'
                      ? 'bg-green-500'
                      : tokenStatus.color === 'red'
                        ? 'bg-red-500'
                        : tokenStatus.color === 'yellow'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                  }`}
                >
                  {React.createElement(tokenStatus.icon, { className: 'w-4 h-4 mr-1' })}
                  {tokenStatus.text}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchTokenData} disabled={loading.token} className='mb-4' variant='outline' size='sm'>
                Refresh Token Data
              </Button>

              {loading.token ? (
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                </div>
              ) : tokenData?.error ? (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Token Error</AlertTitle>
                  <AlertDescription>{tokenData.error}</AlertDescription>
                </Alert>
              ) : tokenData?.tokenExists === false ? (
                <Alert>
                  <Info className='h-4 w-4' />
                  <AlertTitle>No Token</AlertTitle>
                  <AlertDescription>No authentication token was found. Try logging in first.</AlertDescription>
                </Alert>
              ) : tokenData ? (
                <Tabs defaultValue='details'>
                  <TabsList className='mb-2'>
                    <TabsTrigger value='details'>Details</TabsTrigger>
                    <TabsTrigger value='raw'>Raw Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value='details' className='space-y-2'>
                    <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded-md space-y-1'>
                      <p className='grid grid-cols-2'>
                        <span className='font-medium'>Status:</span>
                        <span className={tokenData.isExpired ? 'text-red-500' : 'text-green-500'}>
                          {tokenData.isExpired ? 'Expired' : 'Valid'}
                        </span>
                      </p>
                      <p className='grid grid-cols-2'>
                        <span className='font-medium'>Current Time:</span>
                        <span>{tokenData.currentTime}</span>
                      </p>
                      <p className='grid grid-cols-2'>
                        <span className='font-medium'>Expiration:</span>
                        <span>{tokenData.expirationTime}</span>
                      </p>
                      <p className='grid grid-cols-2'>
                        <span className='font-medium'>Time Until Expiry:</span>
                        <span>
                          {tokenData.timeUntilExpiry !== undefined ? formatTime(tokenData.timeUntilExpiry) : 'N/A'}
                        </span>
                      </p>
                      {tokenData.decodedToken?.sub && (
                        <p className='grid grid-cols-2'>
                          <span className='font-medium'>Subject:</span>
                          <span>{tokenData.decodedToken.sub}</span>
                        </p>
                      )}
                      {tokenData.decodedToken?.email && (
                        <p className='grid grid-cols-2'>
                          <span className='font-medium'>Email:</span>
                          <span>{tokenData.decodedToken.email}</span>
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value='raw'>
                    <div className='text-xs overflow-auto bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                      <pre>{JSON.stringify(tokenData, null, 2)}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : null}
            </CardContent>
          </Card>

          {/* Environment Card */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle>Environment Information</CardTitle>
              <CardDescription>Authentication configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchEnvData} disabled={loading.env} className='mb-4' variant='outline' size='sm'>
                Refresh Environment Data
              </Button>

              {loading.env ? (
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                </div>
              ) : envData?.error ? (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Environment Error</AlertTitle>
                  <AlertDescription>{envData.error}</AlertDescription>
                </Alert>
              ) : envData ? (
                <Tabs defaultValue='env'>
                  <TabsList className='mb-2'>
                    <TabsTrigger value='env'>Environment</TabsTrigger>
                    <TabsTrigger value='cookie'>Session Cookie</TabsTrigger>
                    <TabsTrigger value='raw'>Raw Data</TabsTrigger>
                  </TabsList>
                  <TabsContent value='env' className='space-y-2'>
                    <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded-md space-y-1'>
                      {envData.environment ? (
                        <>
                          <p className='grid grid-cols-2'>
                            <span className='font-medium'>Node Environment:</span>
                            <span>{envData.environment.NODE_ENV || 'Not set'}</span>
                          </p>
                          <p className='grid grid-cols-2'>
                            <span className='font-medium'>AUTH_SECRET:</span>
                            <span>{envData.environment.AUTH_SECRET || 'Not set'}</span>
                          </p>
                          <p className='grid grid-cols-2'>
                            <span className='font-medium'>NEXTAUTH_SECRET:</span>
                            <span>{envData.environment.NEXTAUTH_SECRET || 'Not set'}</span>
                          </p>
                          <p className='grid grid-cols-2'>
                            <span className='font-medium'>AUTH_ISSUER:</span>
                            <span>{envData.environment.AUTH_ISSUER || 'Not set'}</span>
                          </p>
                        </>
                      ) : (
                        <p className='text-yellow-600 dark:text-yellow-400'>Environment data not available</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value='cookie'>
                    <div className='bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                      {envData.cookieName ? (
                        <div className='space-y-1'>
                          <p className='grid grid-cols-2'>
                            <span className='font-medium'>Cookie Name:</span>
                            <span>{envData.cookieName}</span>
                          </p>
                          <p className='grid grid-cols-2'>
                            <span className='font-medium'>Cookie Value:</span>
                            <span className='truncate'>{envData.cookieValue?.substring(0, 20)}...</span>
                          </p>
                        </div>
                      ) : (
                        <p className='text-red-500'>No session cookie found</p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value='raw'>
                    <div className='text-xs overflow-auto bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                      <pre>{JSON.stringify(envData, null, 2)}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting Guide */}
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>Troubleshooting Guide</CardTitle>
            <CardDescription>Common authentication issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h3 className='font-semibold'>Missing Token</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                If no token is found, try logging out and logging back in. Check that cookies are enabled in your
                browser.
              </p>
            </div>
            <div>
              <h3 className='font-semibold'>Token Expired</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                If token is expired, log out and log back in to refresh your session.
              </p>
            </div>
            <div>
              <h3 className='font-semibold'>Different Behavior in Production</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Production environments use secure cookies which require HTTPS. Make sure all environment variables
                (NEXTAUTH_SECRET, AUTH_SECRET) are properly set in both environments.
              </p>
            </div>
            <div>
              <h3 className='font-semibold'>Missing Environment Variables</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Check that all required environment variables are set. In production, environment variables might be set
                differently than in development.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
