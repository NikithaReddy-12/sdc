import { useSyncExternalStore } from 'react'
import { getSiteStore, subscribeToSiteStore } from '../lib/siteStore.ts'

export function useSiteStore() {
  return useSyncExternalStore(subscribeToSiteStore, getSiteStore, getSiteStore)
}
