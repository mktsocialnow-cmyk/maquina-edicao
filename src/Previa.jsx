import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {cor, fonte} from './marca';
import {Vinheta} from './componentes/Vinheta';
import {Pergunta} from './componentes/Pergunta';
import {LinhaConexao} from './componentes/LinhaConexao';
import {DadoMono} from './componentes/DadoMono';
import {Legenda} from './componentes/Legenda';

// Fala de exemplo com tempos simulados (no vídeo real vêm da transcrição).
const fala = 'Toda vez que você abastece, alguém já garantiu que aquele litro é mesmo um litro.'
  .split(' ')
  .map((texto, i) => ({texto, inicio: 0.4 + i * 0.32, fim: 0.4 + (i + 1) * 0.32, chave: texto === 'garantiu'}));

const Cena = () => {
  const f = useCurrentFrame();
  const fim = interpolate(f, [165, 178], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 60%, #24504d 0%, ${cor.petroleo} 55%, #0f2826 100%)`}}>
      {/* Área onde entra o vídeo gravado */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: 560, height: 760, border: `2px dashed ${cor.osso}40`, borderRadius: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonte.dado, fontSize: 26, color: `${cor.osso}80`, marginTop: 220}}>
          [ você aqui ]
        </div>
      </AbsoluteFill>
      <Pergunta linhas={['QUEM GARANTE', 'QUE UM LITRO', 'É UM LITRO?']} destaque="LITRO?" inicio={0} />
      <LinhaConexao de={{x: 420, y: 1100}} para={{x: 860, y: 920}} inicio={40} duracao={18} curva={-0.35} />
      <DadoMono x={600} y={960} rotulo="MEDIÇÃO · 01" valor="1,000 L ± 0,005" inicio={56} largura={400} />
      <Legenda palavras={fala} />
      <AbsoluteFill style={{background: cor.osso, opacity: fim, justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontFamily: fonte.titulo, fontWeight: 800, fontSize: 72, color: cor.grafite}}>
          Vamos conectar os pontos
          <span style={{display: 'inline-block', width: 22, height: 22, borderRadius: 11, background: cor.sinal, marginLeft: 6, boxShadow: `0 0 0 3px ${cor.grafite}`}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Previa = () => (
  <AbsoluteFill style={{background: cor.petroleo}}>
    <Sequence durationInFrames={72}><Vinheta /></Sequence>
    <Sequence from={66}><Cena /></Sequence>
  </AbsoluteFill>
);
