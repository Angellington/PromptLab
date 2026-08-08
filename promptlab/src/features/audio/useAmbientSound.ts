import { useCallback, useEffect, useState } from 'react'
import useSound from 'use-sound'
import dawnTrack from '../../assets/songs/dawn/Calming Summer Morning Ambience That Lovely August Sunny Day in a Meadow.ogg'
import eveningTrack from '../../assets/songs/evening/Persona 5 OST- Beneath the Mask.ogg'
import morningTrack from '../../assets/songs/morning/Pokemon Black White Music - Route 10.ogg'
import nightTrack from '../../assets/songs/night/Zelda Majoras Mask - Night Ambience.ogg'

export type SoundPeriod = 'dawn' | 'morning' | 'evening' | 'night'

const tracks: Record<SoundPeriod, { src: string; title: string }> = {
  dawn: { src: dawnTrack, title: "Calming Summer Morning Ambience That Lovely August Sunny Day in a Meadow" },
  morning: { src: morningTrack, title: "Pokémon Black & White Music — Route 10" },
  evening: { src: eveningTrack, title: "Persona 5 OST — Beneath the Mask" },
  night: { src: nightTrack, title: "Zelda Majora’s Mask — Night Ambience" },
}

export function getSoundPeriod(date = new Date()): SoundPeriod {
  let hour = date.getHours()
  hour = 15
  if (hour < 6) return 'dawn'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'evening'
  return 'night'
}

export function useAmbientSound() {
  const [period, setPeriod] = useState<SoundPeriod>(() => getSoundPeriod())
  const [isPlaying, setIsPlaying] = useState(false)
  const [needsInteraction, setNeedsInteraction] = useState(false)
  const [notificationKey, setNotificationKey] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setPeriod(getSoundPeriod()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const onPlay = useCallback(() => {
    setIsPlaying(true)
    setNeedsInteraction(false)
    setNotificationKey((current) => current + 1)
  }, [])
  const onStop = useCallback(() => setIsPlaying(false), [])
  const onPlayError = useCallback(() => setNeedsInteraction(true), [])

  const [play, { pause, stop }] = useSound(tracks[period].src, {
    loop: true,
    volume: 0.28,
    interrupt: true,
    onplay: onPlay,
    onpause: onStop,
    onstop: onStop,
    onplayerror: onPlayError,
  })

  useEffect(() => {
    play()

    const unlockAndPlay = () => play()
    window.addEventListener('pointerdown', unlockAndPlay, { once: true })
    window.addEventListener('keydown', unlockAndPlay, { once: true })
    window.addEventListener('touchstart', unlockAndPlay, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAndPlay)
      window.removeEventListener('keydown', unlockAndPlay)
      window.removeEventListener('touchstart', unlockAndPlay)
      stop()
    }
  }, [period, play, stop])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  return {
    isPlaying,
    needsInteraction,
    period,
    toggle,
    trackTitle: tracks[period].title,
    notificationKey,
  }
}
