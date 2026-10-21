import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Previa} from './Previa';
import {Edicao as Bruto01, QUADROS_FALA as QUADROS_BRUTO01} from './edicoes/bruto01/Edicao';

const Raiz = () => (
  <>
    <Composition id="Previa" component={Previa} durationInFrames={66 + 190} fps={30} width={1080} height={1920} />
    <Composition id="Bruto01" component={Bruto01} durationInFrames={QUADROS_BRUTO01 + 45} fps={30} width={1080} height={1920} />
  </>
);
registerRoot(Raiz);
