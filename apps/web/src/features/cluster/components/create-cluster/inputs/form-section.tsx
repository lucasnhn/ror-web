import { errorTextStyling } from '@/features/cluster/config/create-cluster-styling'
import { FormSectionProps } from '@/features/cluster/types/create-cluster'

export const FormSection = ({ title, error, children, className }: FormSectionProps) => {
  return (
    <section className={className}>
      <h3>{title}</h3>
      <div>{children}</div>
      {error && <span className={errorTextStyling}>{error}</span>}
    </section>
  )
}
