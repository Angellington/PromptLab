import { useMemo } from 'react'
import { getAmbientProfile } from './ambient'

export function useAmbientProfile() {
  return useMemo(() => getAmbientProfile(), [])
}
