import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {cor, fonte} from '../../marca';
import {LinhaConexao} from '../../componentes/LinhaConexao';
import {DadoMono} from '../../componentes/DadoMono';
import {Legenda} from '../../componentes/Legenda';
import palavrasBrutas from './palavras.json';
import rastreio from './rastreio.json';

export const QUADROS_FALA = rastreio.length;
const FIM_PERGUNTA = 6.75; // segundos: fim de "...você está recebendo?"
const DESCIDA = 190; // px: desce a pessoa para abrir espaço para o título acima da cabeça
const CHAVES = ['calibrada', 'pergunta'];
const palavras = palavrasBrutas.map((p) => ({...p, chave: CHAVES.includes(p.texto)}));

// Converte um ponto do vídeo original para a tela, com a pessoa deslocada para baixo.
const naTela = (p) => ({x: p.x, y: p.y + DESCIDA});

// Posição da mão suavizada (média de 5 quadros) para a linha não tremer.
const maoEm = (f) => {
  const pts = [];
  for (let k = f - 2; k <= f + 2; k++) {
    const q = rastreio[Math.min(Math.max(k, 0), rastreio.length - 1)];
    if (q.maos.length) pts.push(q.maos.reduce((a, m) => (m.y < a.y ? m : a)));
  }
  if (!pts.length) return naTela({x: 480, y: 1560});
  return naTela({x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length});
};

const Cena = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const quadro = Math.min(f, rastreio.length - 1);

  // Segunda parte: aproximação suave (zoom) para dar ritmo.
  const zoom = interpolate(t, [FIM_PERGUNTA, FIM_PERGUNTA + 0.35], [1, 1.12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titulo = spring({frame: f - 4, fps, config: {damping: 200}});
  const sumirTitulo = interpolate(t, [FIM_PERGUNTA - 0.2, FIM_PERGUNTA + 0.1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sumirDado = interpolate(t, [FIM_PERGUNTA - 0.2, FIM_PERGUNTA + 0.1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tag = interpolate(t, [FIM_PERGUNTA + 0.2, FIM_PERGUNTA + 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, #24504d 0%, ${cor.petroleo} 55%, #0f2826 100%)`}}>
      {/* Título atrás da pessoa */}
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', fontFamily: fonte.titulo, fontWeight: 800, fontSize: 170, lineHeight: 0.95, color: cor.osso, opacity: titulo * sumirTitulo, transform: `translateY(${(1 - titulo) * 60}px)`}}>
        A BALANÇA
        <br />
        MENTE?
        <span style={{display: 'inline-block', width: 32, height: 32, borderRadius: 16, background: cor.sinal, marginLeft: 10, transform: `scale(${titulo})`}} />
      </div>
      {/* Pessoa recortada, deslocada para baixo (sem reduzir, para as laterais continuarem inteiras) */}
      <AbsoluteFill style={{transform: `translateY(${DESCIDA}px) scale(${zoom})`, transformOrigin: '50% 30%'}}>
        <Img src={staticFile(`pessoa/${String(quadro).padStart(4, '0')}.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      </AbsoluteFill>

      {/* Linha de Conexão presa à mão até a medição, quando ela diz "peso" */}
      <AbsoluteFill style={{opacity: sumirDado}}>
        <LinhaConexao de={maoEm(quadro)} para={{x: 830, y: 760}} inicio={Math.round(4.2 * fps)} duracao={14} curva={-0.25} />
        <DadoMono x={815} y={795} rotulo="INDICAÇÃO" valor="1,000 kg ± ?" inicio={Math.round(4.6 * fps)} largura={240} tamanho={32} />
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 140, left: 80, fontFamily: fonte.dado, fontSize: 30, letterSpacing: 4, color: cor.osso, opacity: tag}}>
        <span style={{display: 'inline-block', width: 14, height: 14, borderRadius: 7, background: cor.sinal, marginRight: 14}} />
        PERGUNTA · 01
      </div>

      <Legenda palavras={palavras} porBloco={4} base={1360} />
    </AbsoluteFill>
  );
};

const Assinatura = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: cor.osso, justifyContent: 'center', alignItems: 'center', opacity: interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp'})}}>
      <div style={{fontFamily: fonte.titulo, fontWeight: 800, fontSize: 72, color: cor.grafite, transform: `translateY(${(1 - s) * 30}px)`}}>
        Vamos conectar os pontos
        <span style={{display: 'inline-block', width: 22, height: 22, borderRadius: 11, background: cor.sinal, marginLeft: 6, boxShadow: `0 0 0 3px ${cor.grafite}`}} />
      </div>
      <div style={{fontFamily: fonte.dado, fontSize: 28, letterSpacing: 6, color: cor.grafite, opacity: 0.7 * s, marginTop: 30}}>RAFAELLA CARVALHO</div>
    </AbsoluteFill>
  );
};

export const Edicao = () => (
  <AbsoluteFill>
    <Audio src={staticFile('base.mp4')} />
    <Sequence durationInFrames={QUADROS_FALA}><Cena /></Sequence>
    <Sequence from={QUADROS_FALA - 4}><Assinatura /></Sequence>
  </AbsoluteFill>
);
