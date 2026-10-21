import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Previa} from './Previa';

const Raiz = () => (
  <Composition id="Previa" component={Previa} durationInFrames={66 + 190} fps={30} width={1080} height={1920} />
);
registerRoot(Raiz);
