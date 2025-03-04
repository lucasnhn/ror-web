import { Boxes } from 'lucide-react'

import s from './item.module.scss'

export const DashboardIcon = (
  <svg
    aria-hidden='true'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={s.icon}
    viewBox='0 0 24 24'
  >
    <rect width='7' height='7' x='3' y='3' rx='1'></rect>
    <rect width='7' height='7' x='14' y='3' rx='1'></rect>
    <rect width='7' height='7' x='14' y='14' rx='1'></rect>
    <rect width='7' height='7' x='3' y='14' rx='1'></rect>
  </svg>
)

export const ClustersIcon = <Boxes className={s.icon} />

export const StatisticsIcon = (
  <svg
    aria-hidden='true'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={s.icon}
    viewBox='0 0 24 24'
  >
    <path d='M3 3v16a2 2 0 0 0 2 2h16M18 17V9M13 17V5M8 17v-3'></path>
  </svg>
)

export const EconomyIcon = (
  <svg
    aria-hidden='true'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={s.icon}
    viewBox='0 0 24 24'
  >
    <path d='M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17'></path>
    <path d='m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9M2 16l6 6'></path>
    <circle cx='16' cy='9' r='2.9'></circle>
    <circle cx='6' cy='5' r='3'></circle>
  </svg>
)

export const AdministrationIcon = (
  <svg
    aria-hidden='true'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={s.icon}
    viewBox='0 0 24 24'
  >
    <path d='M20 7h-9M14 17H5'></path>
    <circle cx='17' cy='17' r='3'></circle>
    <circle cx='7' cy='7' r='3'></circle>
  </svg>
)

export const HelpIcon = (
  <svg
    aria-hidden='true'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    className={s.icon}
    viewBox='0 0 24 24'
  >
    <circle cx='12' cy='12' r='10'></circle>
    <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'></path>
  </svg>
)

export const DataCenterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-building-2 ${className}`} 
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
  </svg>
)

export const BriefcaseBusinessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24"
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-briefcase-business ${className}`} 
  >
    <path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/>
  </svg>
)

export const BoxesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg  
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-boxes ${className}`} 
  >
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/>
    <path d="m7 16.5-4.74-2.85"/>
    <path d="m7 16.5 5-3"/>
    <path d="M7 16.5v5.17"/>
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/>
    <path d="m17 16.5-5-3"/>
    <path d="m17 16.5 4.74-2.85"/>
    <path d="M17 16.5v5.17"/>
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/>
    <path d="M12 8 7.26 5.15"/>
    <path d="m12 8 4.74-2.85"/>
    <path d="M12 13.5V8"/>
  </svg>
)

export const BoxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-box ${className}`} 
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/>
    <path d="M12 22V12"/>
  </svg>
)

export const CpuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-cpu ${className}`} 
  >
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2"/>
    <path d="M15 20v2"/>
    <path d="M2 15h2"/>
    <path d="M2 9h2"/>
    <path d="M20 15h2"/>
    <path d="M20 9h2"/>
    <path d="M9 2v2"/>
    <path d="M9 20v2"/>
  </svg>
)

export const HardDriveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-hard-drive ${className}`} 
  >
    <line x1="22" x2="2" y1="12" y2="12"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    <line x1="6" x2="6.01" y1="16" y2="16"/>
    <line x1="10" x2="10.01" y1="16" y2="16"/>
  </svg>
)

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-pencil ${className}`} 
  >
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
    <path d="m15 5 4 4"/>
  </svg>
)

export const PencilOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-pencil-off ${className}`} 
  >
    <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982"/>
    <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353"/>
    <path d="m15 5 4 4"/>
    <path d="m2 2 20 20"/>
  </svg>
)

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg  
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-plus ${className}`} 
  >
    <path d="M5 12h14"/>
    <path d="M12 5v14"/>
  </svg>
)

export const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-x ${className}`} 
  >
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
)