export type AmbientProfile = {
  id: string
  label: string
  playlistHint: string
  background: string
  glow: string
  panel: string
}

const profiles: Record<string, AmbientProfile> = {
  dawn: {
    id: 'dawn',
    label: 'Madrugada calma',
    playlistHint: 'pads leves, piano baixo e textura de chuva',
    background: 'linear-gradient(135deg, #0b1117 0%, #17202a 52%, #203336 100%)',
    glow: 'rgba(98, 205, 198, 0.22)',
    panel: 'rgba(13, 20, 27, 0.78)',
  },
  morning: {
    id: 'morning',
    label: 'Manha clara',
    playlistHint: 'lo-fi claro, sintetizadores macios e batida curta',
    background: 'linear-gradient(135deg, #121821 0%, #1e3433 48%, #59683f 100%)',
    glow: 'rgba(201, 219, 127, 0.2)',
    panel: 'rgba(17, 25, 31, 0.78)',
  },
  afternoon: {
    id: 'afternoon',
    label: 'Tarde produtiva',
    playlistHint: 'downtempo, percussao seca e baixo discreto',
    background: 'linear-gradient(135deg, #10151c 0%, #263243 48%, #745245 100%)',
    glow: 'rgba(238, 155, 108, 0.2)',
    panel: 'rgba(16, 21, 28, 0.8)',
  },
  night: {
    id: 'night',
    label: 'Noite imersiva',
    playlistHint: 'ambient escuro, subgrave limpo e granular leve',
    background: 'linear-gradient(135deg, #070b11 0%, #141827 48%, #203144 100%)',
    glow: 'rgba(90, 166, 255, 0.18)',
    panel: 'rgba(8, 12, 19, 0.82)',
  },
}

export function getAmbientProfile(date = new Date()): AmbientProfile {
  const hour = date.getHours()

  if (hour < 6) {
    return profiles.dawn
  }

  if (hour < 12) {
    return profiles.morning
  }

  if (hour < 18) {
    return profiles.afternoon
  }

  return profiles.night
}
