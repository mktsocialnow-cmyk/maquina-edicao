#!/usr/bin/env bash
# Instala tudo que a Máquina de Edição precisa. Pode rodar mais de uma vez.
set -e
cd "$(dirname "$0")"

# Bibliotecas de sistema usadas pelo rastreio de rosto/mão
if ! ldconfig -p | grep -q libEGL.so.1; then
  apt-get update -q && apt-get install -y -q libegl1 libgles2
fi

npm install --no-fund --no-audit
pip install -q mediapipe openai-whisper

# Modelos de visão (rosto, mão, recorte da pessoa)
mkdir -p models
base=https://storage.googleapis.com/mediapipe-models
[ -f models/hand_landmarker.task ] || curl -sSL -o models/hand_landmarker.task "$base/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
[ -f models/selfie_segmenter.tflite ] || curl -sSL -o models/selfie_segmenter.tflite "$base/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"
[ -f models/face_detector.tflite ] || curl -sSL -o models/face_detector.tflite "$base/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"

echo "Pronto."
