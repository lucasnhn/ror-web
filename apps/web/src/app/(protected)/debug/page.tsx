import { jwtDecode } from 'jwt-decode'
import { authGuard } from '@/features/auth/utils/auth-guard'
import { CodeSnippet, DefinitionDescription, DefinitionList, DefinitionTerm, Layer, Tile } from '@ror/react'
import { Fragment } from 'react'

export default async function DebugPage() {
  const session = await authGuard()
  const decodedAuthToken = jwtDecode(session.accessToken)
  return (
    <div className='p-10'>
      <header>
        <h1 className='mb-2'>Debug</h1>
      </header>

      <div className='mt-10 grid grid-cols-12 gap-8 max-w-[60rem]'>
        <div className='col-span-6'>
          <Tile className='p-5'>
            <h3 className='r-heading-03 mb-8'>Access token</h3>
            <DefinitionList className='justify-between'>
              <DefinitionTerm>Audience</DefinitionTerm>
              <DefinitionDescription>{decodedAuthToken.aud}</DefinitionDescription>
              <DefinitionTerm>Issuer</DefinitionTerm>
              <DefinitionDescription>{decodedAuthToken.iss}</DefinitionDescription>
              {decodedAuthToken.exp ? (
                <Fragment>
                  <DefinitionTerm>Expires</DefinitionTerm>
                  <DefinitionDescription>
                    {new Date(decodedAuthToken.exp * 1000).toLocaleString()}
                  </DefinitionDescription>
                </Fragment>
              ) : null}
              {decodedAuthToken.iat ? (
                <Fragment>
                  <DefinitionTerm>Issued</DefinitionTerm>
                  <DefinitionDescription>
                    {new Date(decodedAuthToken.iat * 1000).toLocaleString()}
                  </DefinitionDescription>
                </Fragment>
              ) : null}
            </DefinitionList>
            <hr className='my-4' />
            <h3 className='font-semibold text-sm mb-2'>Your access token</h3>
            <Layer level={1}>
              <CodeSnippet type='single'>{session.accessToken}</CodeSnippet>
            </Layer>
            <h3 className='font-semibold text-sm mb-2 mt-4'>Your access token (with Bearer)</h3>
            <Layer level={1}>
              <CodeSnippet type='single'>{`Bearer ${session.accessToken}`}</CodeSnippet>
            </Layer>
          </Tile>
        </div>
      </div>
    </div>
  )
}
