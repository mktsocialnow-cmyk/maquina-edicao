import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import React from 'react';
const Teste = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f, fps});
  return <AbsoluteFill style={{background:'#0b0614', justifyContent:'center', alignItems:'center'}}>
    <div style={{fontFamily:'sans-serif', fontWeight:900, fontSize:110, color:'white', transform:`scale(${s})`, textAlign:'center'}}>
      TESTE<br/><span style={{color:'#b46bff'}}>OK</span></div>
    <div style={{position:'absolute', top:80, left:60, color:'#b46bff', fontFamily:'monospace', fontSize:32, opacity: interpolate(f,[0,15],[0,1])}}>● EDITANDO AO VIVO {String(f).padStart(4,'0')}</div>
  </AbsoluteFill>;
};
registerRoot(() => <Composition id="Teste" component={Teste} durationInFrames={60} fps={30} width={1080} height={1920}/>);
