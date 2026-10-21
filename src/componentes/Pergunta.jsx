import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {cor, fonte} from '../marca';

// Gancho: a pergunta entra palavra por palavra. `destaque` recebe o Ponto Sinal.
export const Pergunta = ({linhas, destaque, inicio = 0, topo = 260}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  let i = 0;
  return (
    <div style={{position: 'absolute', top: topo, left: 80, right: 80}}>
      {linhas.map((linha, li) => (
        <div key={li} style={{fontFamily: fonte.titulo, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: cor.osso}}>
          {linha.split(' ').map((p, pi) => {
            const s = spring({frame: f - inicio - 3 * i++, fps, config: {damping: 200}});
            const marcado = p === destaque;
            return (
              <span key={pi} style={{display: 'inline-block', marginRight: 26, opacity: s, transform: `translateY(${(1 - s) * 40}px)`, position: 'relative'}}>
                {p}
                {marcado && <span style={{position: 'absolute', right: -22, top: 10, width: 20, height: 20, borderRadius: 10, background: cor.sinal, transform: `scale(${s})`}} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
