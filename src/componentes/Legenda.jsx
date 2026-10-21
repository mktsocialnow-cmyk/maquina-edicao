import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {cor, fonte} from '../marca';

// Legenda sincronizada por palavra. `palavras`: [{texto, inicio, fim, chave?}] em segundos.
// Mostra blocos de até `porBloco` palavras; a palavra-chave ganha o Ponto Sinal embaixo.
export const Legenda = ({palavras, porBloco = 4, base = 1380}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const agora = f / fps;
  // Quebra em blocos de até `porBloco` palavras, sem misturar frases.
  const blocos = [];
  let atual = [];
  for (const p of palavras) {
    atual.push(p);
    if (atual.length === porBloco || /[.?!]$/.test(p.texto)) {
      blocos.push(atual);
      atual = [];
    }
  }
  if (atual.length) blocos.push(atual);
  const bloco = blocos.find((b) => agora >= b[0].inicio && agora < b[b.length - 1].fim + 0.15);
  if (!bloco) return null;
  return (
    <div style={{position: 'absolute', top: base, left: 60, right: 60, textAlign: 'center'}}>
      {bloco.map((p, i) => {
        const dito = agora >= p.inicio;
        const ponto = p.chave ? interpolate(agora - p.inicio, [0, 0.15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        return (
          <span key={i} style={{display: 'inline-block', position: 'relative', margin: '0 12px', fontFamily: fonte.texto, fontWeight: 600, fontSize: 64, color: cor.osso, opacity: dito ? 1 : 0.35, textShadow: '0 2px 12px rgba(0,0,0,.45)'}}>
            {p.texto}
            {p.chave && <span style={{position: 'absolute', left: '50%', bottom: -22, width: 16, height: 16, marginLeft: -8, borderRadius: 8, background: cor.sinal, transform: `scale(${ponto})`}} />}
          </span>
        );
      })}
    </div>
  );
};
