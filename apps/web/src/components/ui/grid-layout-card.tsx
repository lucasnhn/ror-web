export const CardHeader = ({ title }: { title: string }) => (
  <div className='mb-2'>
    <h2 className='text-xl font-semibold'>{title}</h2>
    <hr />
  </div>
)

export const CardItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className='flex flex-col'>
    <p className='font-bold'>{label}</p>
    <p>{children}</p>
  </div>
)
