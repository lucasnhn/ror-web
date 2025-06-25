import Link from 'next/link'

interface ErrorpageProps {
  errorText: string
  errorButtonText: string
  errorButtonLink: string
  errorCode: string
}

export default function Error({ errorText, errorButtonText, errorCode, errorButtonLink }: ErrorpageProps) {
  return (
    <div>
      <h2>ERROR</h2>
      <h2>{errorCode}</h2>
      <p>{errorText}</p>
      <button>
        <Link href={errorButtonLink}>{errorButtonText}</Link>
      </button>
    </div>
  )
}
