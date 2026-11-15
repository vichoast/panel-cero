import React from 'react';
import { CharacterId } from '../types';

interface CharacterPortraitProps {
  characterId: CharacterId;
  expression?: 'neutral' | 'blush' | 'intense' | 'smirk' | 'look-away' | 'shock';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'stage';
  className?: string;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  characterId,
  expression = 'neutral',
  size = 'md',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-36',
    xl: 'w-44 h-52',
    xs: 'w-9 h-9',
    stage: 'w-[42vw] max-w-[12.5rem] aspect-[5/6]',
  }[size];

  const isBlushing = expression === 'blush' || expression === 'shock';
  const isIntense = expression === 'intense';

  return (
    <div
      className={`relative overflow-hidden select-none shrink-0 ${dimensions} ${className}`}
      aria-label={`Retrato de ${characterId}`}
    >
      {characterId === 'noctis' && (
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <defs>
            <linearGradient id="noctisBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="55%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="noctisHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <rect width="200" height="240" fill="url(#noctisBg)" />
          {/* Crescent Moon & Ink Stroke Halo (Aphelios / Hwei motif) */}
          <circle cx="145" cy="52" r="28" fill="#38bdf8" fillOpacity="0.14" />
          <circle cx="154" cy="46" r="24" fill="#131836" />
          <path
            d="M15 190 Q95 140 185 205"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeOpacity="0.3"
            fill="none"
          />
          {/* Back hair */}
          <path d="M42 75 Q30 155 24 235 L176 235 Q170 155 158 75 Z" fill="#0b1120" />
          {/* Neck & Dark turtleneck + loose artist coat */}
          <path d="M84 148 L84 185 L116 185 L116 148 Z" fill="#e2e8f0" />
          <path d="M35 240 L55 172 L84 166 L116 166 L145 172 L165 240 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <path d="M80 165 L100 205 L120 165 Z" fill="#1e293b" />
          {/* Teal ink tear mark on collarbone/scarf */}
          <path d="M95 182 Q100 198 92 215" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.7" />
          {/* Face contour - delicate androgynous chin */}
          <path
            d="M62 78 Q62 132 100 154 Q138 132 138 78 Q138 44 100 44 Q62 44 62 78 Z"
            fill="#f1f5f9"
          />
          {/* Soft melancholic eye bags / shading */}
          <path d="M71 106 Q81 110 89 106" stroke="#94a3b8" strokeWidth="1.2" fill="none" opacity="0.65" />
          <path d="M111 106 Q119 110 129 106" stroke="#94a3b8" strokeWidth="1.2" fill="none" opacity="0.65" />
          {/* Eyes - bi-colored / moonlit cyan & violet */}
          <ellipse cx="80" cy="100" rx="8" ry={isIntense ? '6.5' : '5.5'} fill="#0f172a" />
          <circle cx="80" cy="100" r="4" fill="#38bdf8" />
          <circle cx="78" cy="98" r="1.5" fill="#ffffff" />
          <ellipse cx="120" cy="100" rx="8" ry={isIntense ? '6.5' : '5.5'} fill="#0f172a" />
          <circle cx="120" cy="100" r="4" fill="#818cf8" />
          <circle cx="118" cy="98" r="1.5" fill="#ffffff" />
          {/* Under-eye moon mark */}
          <path d="M74 112 L74 120" stroke="#38bdf8" strokeWidth="1.5" opacity="0.75" />
          {/* Eyebrows - melancholic slant */}
          <path d="M68 90 Q79 86 90 93" stroke="#1e293b" strokeWidth="2" fill="none" />
          <path d="M132 90 Q121 86 110 93" stroke="#1e293b" strokeWidth="2" fill="none" />
          {/* Blush */}
          {isBlushing && (
            <g opacity="0.55">
              <ellipse cx="74" cy="113" rx="9" ry="4.5" fill="#fb7185" />
              <ellipse cx="126" cy="113" rx="9" ry="4.5" fill="#fb7185" />
            </g>
          )}
          {/* Mouth */}
          {expression === 'smirk' ? (
            <path d="M94 134 Q102 136 108 131" stroke="#475569" strokeWidth="2" fill="none" />
          ) : expression === 'shock' ? (
            <ellipse cx="100" cy="134" rx="4" ry="5" fill="#475569" />
          ) : (
            <path d="M93 134 Q100 132 107 134" stroke="#475569" strokeWidth="1.8" fill="none" />
          )}
          {/* Asymmetric long emo bangs covering part of right side */}
          <path
            d="M52 72 Q65 30 104 32 Q144 34 150 78 Q145 120 136 165 Q128 110 122 76 Q112 114 96 132 Q98 92 88 72 Q76 105 64 148 Q54 115 52 72 Z"
            fill="url(#noctisHair)"
          />
        </svg>
      )}

      {characterId === 'vesper' && (
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <defs>
            <linearGradient id="vesperBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="60%" stopColor="#271722" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="maskGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fafafa" />
              <stop offset="65%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
          </defs>
          <rect width="200" height="240" fill="url(#vesperBg)" />
          {/* 4-point stage motif */}
          <polygon points="100,14 104,26 116,30 104,34 100,46 96,34 84,30 96,26" fill="#f43f5e" fillOpacity="0.28" />
          {/* High-collar theatrical coat */}
          <path d="M30 240 L48 160 L82 146 L118 146 L152 160 L170 240 Z" fill="#18181b" stroke="#f43f5e" strokeWidth="1.2" strokeOpacity="0.45" />
          <path d="M74 148 L100 215 L126 148" fill="#881337" opacity="0.65" />
          {/* Neck */}
          <path d="M85 144 L85 178 L115 178 L115 144 Z" fill="#f8fafc" />
          {/* Face */}
          <path
            d="M62 76 Q62 132 100 154 Q138 132 138 76 Q138 42 100 42 Q62 42 62 76 Z"
            fill="#f8fafc"
          />
          {/* Left visible eye (piercing crimson/amber Jhin vibe) */}
          <ellipse cx="78" cy="100" rx="8.5" ry="5.5" fill="#09090b" />
          <circle cx="78" cy="100" r="4" fill="#f43f5e" />
          <circle cx="76" cy="98" r="1.5" fill="#ffffff" />
          <path d="M65 89 Q78 84 91 91" stroke="#27272a" strokeWidth="2.2" fill="none" />
          {/* Blush on uncovered cheek */}
          {isBlushing && (
            <ellipse cx="73" cy="115" rx="9" ry="4.5" fill="#fb7185" opacity="0.55" />
          )}
          {/* Ornate Half-Phantom Mask covering right half of face */}
          <path
            d="M97 45 Q138 48 140 88 Q138 130 103 148 L96 122 L101 98 L95 74 Z"
            fill="url(#maskGold)"
            stroke="#d4af37"
            strokeWidth="1.5"
          />
          {/* Mask slit eye & filigree */}
          <path d="M108 99 Q120 94 131 100 Q120 104 108 99 Z" fill="#be123c" />
          <path d="M118 75 Q128 84 124 124" stroke="#b45309" strokeWidth="1.3" fill="none" opacity="0.65" />
          <circle cx="120" cy="114" r="2" fill="#e11d48" />
          {/* Mouth - theatrical smirk */}
          {expression === 'shock' ? (
            <ellipse cx="98" cy="135" rx="4" ry="4.5" fill="#881337" />
          ) : (
            <path d="M88 134 Q98 139 109 131" stroke="#881337" strokeWidth="2.2" fill="none" />
          )}
          {/* Swept silver-charcoal hair */}
          <path
            d="M52 76 Q58 28 102 30 Q148 32 152 80 Q146 58 124 52 Q112 72 98 82 Q92 56 76 58 Q66 85 58 120 Z"
            fill="#27272a"
          />
        </svg>
      )}

      {characterId === 'kazuha' && (
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <defs>
            <linearGradient id="kazuhaBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f1624" />
              <stop offset="60%" stopColor="#3b1d2e" />
              <stop offset="100%" stopColor="#140f17" />
            </linearGradient>
          </defs>
          <rect width="200" height="240" fill="url(#kazuhaBg)" />
          {/* 2000s Shojo Sakura / Kitsune Foxfire */}
          <circle cx="42" cy="54" r="5" fill="#fda4af" opacity="0.4" />
          <circle cx="162" cy="70" r="7" fill="#fda4af" opacity="0.3" />
          {/* Silver Fox Ears (Tomoe / Kamisama Hajimemashita homage!) */}
          <polygon points="52,58 34,12 82,42" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="54,52 42,22 74,42" fill="#fda4af" opacity="0.6" />
          <polygon points="148,58 166,12 118,42" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="146,52 158,22 126,42" fill="#fda4af" opacity="0.6" />
          {/* Modern Haori / Kimono Collar */}
          <path d="M32 240 L52 168 L84 156 L116 156 L148 168 L168 240 Z" fill="#1e1b2e" stroke="#fda4af" strokeWidth="1.2" strokeOpacity="0.4" />
          <path d="M78 156 L100 212 L122 156" fill="#9f1239" />
          {/* Neck */}
          <path d="M85 145 L85 178 L115 178 L115 145 Z" fill="#fff1f2" />
          {/* Face */}
          <path
            d="M62 78 Q62 132 100 154 Q138 132 138 78 Q138 44 100 44 Q62 44 62 78 Z"
            fill="#fff1f2"
          />
          {/* Slanted Kitsune Amber/Violet Eyes */}
          <path d="M68 98 Q80 91 91 100 Q80 105 68 98 Z" fill="#1e1b4b" />
          <circle cx="80" cy="98" r="4" fill="#f59e0b" />
          <ellipse cx="80" cy="98" rx="1.2" ry="3.5" fill="#09090b" />
          <path d="M109 100 Q120 91 132 98 Q120 105 109 100 Z" fill="#1e1b4b" />
          <circle cx="120" cy="98" r="4" fill="#f59e0b" />
          <ellipse cx="120" cy="98" rx="1.2" ry="3.5" fill="#09090b" />
          {/* Tsundere sharp eyebrows */}
          <path d="M67 87 L91 92" stroke="#64748b" strokeWidth="2.2" />
          <path d="M133 87 L109 92" stroke="#64748b" strokeWidth="2.2" />
          {/* Heavy Tsundere Blush */}
          {isBlushing && (
            <g opacity="0.7">
              <ellipse cx="75" cy="112" rx="10" ry="5" fill="#fb7185" />
              <ellipse cx="125" cy="112" rx="10" ry="5" fill="#fb7185" />
              <line x1="70" y1="110" x2="78" y2="115" stroke="#e11d48" strokeWidth="1.2" />
              <line x1="122" y1="110" x2="130" y2="115" stroke="#e11d48" strokeWidth="1.2" />
            </g>
          )}
          {/* Mouth with tiny kitsune fang */}
          <path d="M91 133 Q100 130 109 133" stroke="#881337" strokeWidth="2" fill="none" />
          <polygon points="104,133 106,138 108,133" fill="#ffffff" />
          {/* Silver-white layered hair */}
          <path
            d="M50 82 Q55 34 100 34 Q145 34 150 82 Q144 128 138 168 Q132 108 124 74 Q110 104 100 112 Q90 98 78 74 Q68 110 62 168 Q54 128 50 82 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1"
          />
        </svg>
      )}

      {characterId === 'renji' && (
        <svg viewBox="0 0 200 240" className="w-full h-full">
          <defs>
            <linearGradient id="renjiBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <rect width="200" height="240" fill="url(#renjiBg)" />
          {/* Open hoodie + Gintama-style relaxed vibe */}
          <path d="M30 240 L48 168 L84 158 L116 158 L152 168 L170 240 Z" fill="#f8fafc" />
          <path d="M74 158 L100 225 L126 158" fill="#0f172a" />
          {/* Neck */}
          <path d="M85 145 L85 178 L115 178 L115 145 Z" fill="#ffedd5" />
          {/* Face */}
          <path
            d="M62 78 Q62 132 100 154 Q138 132 138 78 Q138 44 100 44 Q62 44 62 78 Z"
            fill="#ffedd5"
          />
          {/* Deadpan / Lazy charming crimson-brown eyes (Gintoki energy) */}
          <path d="M68 97 L90 97" stroke="#1e293b" strokeWidth="2.6" />
          <circle cx="79" cy="101" r="4.5" fill="#991b1b" />
          <path d="M110 97 L132 97" stroke="#1e293b" strokeWidth="2.6" />
          <circle cx="121" cy="101" r="4.5" fill="#991b1b" />
          {/* Relaxed eyebrows */}
          <path d="M68 88 Q79 84 89 89" stroke="#334155" strokeWidth="2" fill="none" />
          <path d="M111 89 Q121 84 132 88" stroke="#334155" strokeWidth="2" fill="none" />
          {isBlushing && (
            <g opacity="0.65">
              <ellipse cx="75" cy="113" rx="9" ry="4.5" fill="#fb7185" />
              <ellipse cx="125" cy="113" rx="9" ry="4.5" fill="#fb7185" />
            </g>
          )}
          {/* Playful grin */}
          <path d="M88 132 Q100 141 112 131" stroke="#7c2d12" strokeWidth="2.2" fill="none" />
          {/* Wavy messy perm / 2000s anime hair */}
          <path
            d="M46 74 Q54 26 100 28 Q146 26 154 74 Q162 94 144 114 Q136 74 120 68 Q110 94 96 88 Q84 66 72 86 Q60 106 54 118 Q40 94 46 74 Z"
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="1.2"
          />
        </svg>
      )}
    </div>
  );
};
