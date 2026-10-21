import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {cor, fonte} from '../marca';

// Microinformação em IBM Plex Mono com régua de medição: a metrologia como estética.
export const DadoMono = ({x, y, rotulo, valor, inicio = 0, largura = 360, tamanho = 40}) => {
  const f = useCurrentFrame();
  const t = interpolate(f - inicio, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const chars = Math.round(valor.length * t);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: largura, fontFamily: fonte.dado, color: cor.osso, opacity: t > 0 ? 1 : 0}}>
      <div style={{fontSize: 22, letterSpacing: 3, opacity: 0.7}}>{rotulo}</div>
      <div style={{fontSize: tamanho, marginTop: 6, whiteSpace: 'nowrap'}}>{valor.slice(0, chars)}</div>
      <svg width={largura} height={26} style={{marginTop: 8}}>
        <line x1={0} y1={2} x2={largura * t} y2={2} stroke={cor.osso} strokeWidth={2} />
        {Array.from({length: 13}).map((_, k) => {
          const px = (largura / 12) * k;
          return px <= largura * t ? <line key={k} x1={px} y1={2} x2={px} y2={k % 6 === 0 ? 24 : 12} stroke={cor.osso} strokeWidth={2} /> : null;
        })}
      </svg>
    </div>
  );
};
