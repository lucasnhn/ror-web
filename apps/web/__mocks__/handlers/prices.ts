import { http, HttpResponse } from 'msw'
import { getRorAPIPath } from '../utils/mock-base-url'
import prices from '../data/prices'
// import { prices } from '../data/prices' // Your mock prices data

// Example: GET all prices
export const pricesHandlers = [
  http.get(getRorAPIPath('/v1/prices'), () => {
    // Return all prices as JSON
    return HttpResponse.json(prices)
  }),
]
