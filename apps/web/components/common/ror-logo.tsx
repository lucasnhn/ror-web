import { SVGProps } from 'react'

type RorLogoProps = SVGProps<SVGSVGElement>;

export function RorLogo(props: RorLogoProps) {
  return (
    <svg viewBox='0 0 708 708' xmlns='http://www.w3.org/2000/svg' width='708' height='708' {...props}>
      <defs>
        <radialGradient id='grad1' cx='100%' cy='30%' r='60%'>
          <stop offset='0%' stopColor='#007864'></stop>
          <stop offset='100%' stopColor='#00A06E'></stop>
        </radialGradient>
        <radialGradient id='grad2' cx='80%' cy='40%' r='100%'>
          <stop offset='0%' stopColor='#0096AA'></stop>
          <stop offset='100%' stopColor='#00C7D2'></stop>
        </radialGradient>
        <radialGradient id='grad3' cx='70%' cy='10%' r='100%'>
          <stop offset='0%' stopColor='#00B4AA'></stop>
          <stop offset='100%' stopColor='#00FAB4'></stop>
        </radialGradient>
      </defs>
      <path stroke='#70b5ea' strokeWidth='10' d='m315 191 35 119'></path>
      <path stroke='#1958A0' strokeWidth='10' d='m260 220-70 90'></path>
      <path stroke='#70bea' strokeWidth='10' d='m190 335 100 57'></path>
      <path stroke='#20A44D' strokeWidth='10' d='m420 455-130-63'></path>
      <path stroke='#70b5ea' strokeWidth='10' d='M470 350 340 520'></path>
      <path stroke='#7b5ea' strokeWidth='10' d='m480 350-40 90'></path>
      <path stroke='#1958A0' strokeWidth='10' d='m480 350-40 90'></path>
      <path stroke='#70b5ea' strokeWidth='10' d='m408 180 12 140'></path>/&gt;
      <circle cx='337' cy='116' r='20' fill='#2EC1EB'></circle>
      <circle cx='253' cy='213' r='50' fill='url(#grad1)'></circle>
      <circle cx='329' cy='191' r='40' fill='#1958A0'></circle>
      <circle cx='408' cy='180' r='40' fill='#2EC1EB'></circle>
      <circle cx='170' cy='320' r='60' fill='#1958A0'></circle>
      <circle cx='292' cy='392' r='55' fill='url(#grad3)'></circle>
      <circle cx='336' cy='310' r='45' fill='url(#grad2)'></circle>
      <circle cx='420' cy='291' r='60' fill='#1958A0'></circle>
      <circle cx='115' cy='392' r='20' fill='#1958A0'></circle>
      <circle cx='465' cy='360' r='35' fill='#2058A0'></circle>
      <circle cx='425' cy='450' r='50' fill='#20C34D'></circle>
      <circle cx='200' cy='460' r='30' fill='#20D24D'></circle>
      <circle cx='340' cy='526' r='55' fill='#20B84D'></circle>
      <circle cx='280' cy='477' r='30' fill='#20A44D'></circle>
      <circle cx='270' cy='563' r='20' fill='#20B84D'></circle>
      <circle cx='531' cy='310' r='20' fill='#2EC1EB'></circle>
    </svg>
  )
}
