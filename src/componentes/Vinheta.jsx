import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {cor, fonte} from '../marca';
import {LinhaConexao} from './LinhaConexao';

// Seção 10 do manual: PONTO → LINHA SE MOVIMENTA → ENCONTRA OUTRO PONTO → RAFAELLA CARVALHO
export const Vinheta = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const nome = spring({frame: f - 34, fps, config: {damping: 200}});
  const saida = interpolate(f, [62, 72], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pontoInicial = spring({frame: f, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{background: cor.petroleo, opacity: saida}}>
      <svg style={{position: 'absolute', inset: 0}} width={width} height={height}>
        <circle cx={240} cy={820} r={14 * pontoInicial} fill={cor.osso} />
      </svg>
      <LinhaConexao de={{x: 240, y: 820}} para={{x: 840, y: 820}} inicio={8} duracao={24} curva={0.45} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 180}}>
        <div style={{fontFamily: fonte.titulo, fontWeight: 800, fontSize: 84, color: cor.osso, letterSpacing: 2, opacity: nome, transform: `translateY(${(1 - nome) * 30}px)`}}>
          RAFAELLA CARVALHO
        </div>
        <div style={{fontFamily: fonte.texto, fontSize: 36, color: cor.osso, opacity: nome * 0.75, marginTop: 18}}>
          Onde as ideias se conectam.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
