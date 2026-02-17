import { authGuard } from '@/features/auth/utils/auth-guard'
import { getRorApi } from '@/services/ror-api'
import { localizeDate } from '@/utils/time-and-date'
import { CodeSnippet } from '@ror/react/components/code-snippet'
import { DefinitionDescription, DefinitionList, DefinitionTerm } from '@ror/react/components/definition-list'
import { Layer } from '@ror/react/components/layer'
import { Tile } from '@ror/react/components/tile'
import { jwtDecode } from 'jwt-decode'
import { Fragment } from 'react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await authGuard()
  const api = await getRorApi()
  const decodedAuthToken = jwtDecode(session.accessToken)
  const self = await api.users.self()
  const acls: string[] = self.user.groups
  const aclsBeingUsed = []
  const aclsNotBeingUsed = []

  for (const acl of acls) {
    const group = await api.acl.getByName(acl)
    if (group != null && group.group) {
      aclsBeingUsed.push(group)
    } else {
      aclsNotBeingUsed.push(group)
    }
  }

  return (
    <div className='p-10'>
      <header>
        <h1 className='mb-2'>{self.user.name}</h1>
        <p className='text-(--r-text-secondary)'>{self.user.email}</p>
      </header>

      <div className='mt-10 grid grid-cols-12 gap-8 max-w-[60rem]'>
        <div className='col-span-8'>
          <Tile className='p-5'>
            <h3 className='r-heading-03 mb-8'>Groups that grant access in ROR</h3>
            <ul className='list-disc list-inside'>
              {aclsBeingUsed.map((group) => (
                <li key={group.group} className='mb-1'>
                  {group.group}
                </li>
              ))}
            </ul>
            <hr />
            <h3 className='r-heading-03 mb-8'>Groups that does not grant access in ROR</h3>
            <ul className='list-disc list-inside'>
              {aclsNotBeingUsed.map((group) => (
                <li key={group.group} className='mb-1'>
                  {group.group}
                </li>
              ))}
            </ul>
          </Tile>
        </div>
        <div className='col-span-4'>
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
                  <DefinitionDescription>{localizeDate(new Date(decodedAuthToken.exp * 1000))}</DefinitionDescription>
                </Fragment>
              ) : null}
              {decodedAuthToken.iat ? (
                <Fragment>
                  <DefinitionTerm>Issued</DefinitionTerm>
                  <DefinitionDescription>{localizeDate(new Date(decodedAuthToken.iat * 1000))}</DefinitionDescription>
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
