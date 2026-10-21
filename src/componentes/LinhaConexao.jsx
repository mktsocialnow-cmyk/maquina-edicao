import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {cor} from '../marca';

// Linha de Conexão: liga dois pontos com uma curva que se desenha.
// O ponto de chegada é o Ponto Sinal (amarelo).
export const LinhaConexao = ({de, para, inicio = 0, duracao = 20, curva = 0.3, espessura = 4, corLinha = cor.osso}) => {
  const f = useCurrentFrame();
  const t = interpolate(f - inicio, [0, duracao], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const mx = (de.x + para.x) / 2 - (para.y - de.y) * curva;
  const my = (de.y + para.y) / 2 + (para.x - de.x) * curva;
  const d = `M ${de.x} ${de.y} Q ${mx} ${my} ${para.x} ${para.y}`;
  const chegou = interpolate(f - inicio - duracao, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%">
      <circle cx={de.x} cy={de.y} r={9} fill={corLinha} opacity={t > 0 ? 1 : 0} />
      <path d={d} fill="none" stroke={corLinha} strokeWidth={espessura} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      <circle cx={para.x} cy={para.y} r={14 * chegou} fill={cor.sinal} />
    </svg>
  );
};
