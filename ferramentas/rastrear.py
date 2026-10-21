"""Recorta a pessoa e rastreia mãos/rosto, quadro a quadro.

Uso: python3 ferramentas/rastrear.py public/base.mp4 public/pessoa public/rastreio.json
Gera um PNG com fundo transparente por quadro (para texto atrás da pessoa)
e um JSON com a posição das mãos e do rosto em pixels.
"""
import json, os, subprocess, sys
import numpy as np
import mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
from PIL import Image, ImageFilter

video, pasta, saida_json = sys.argv[1:4]
os.makedirs(pasta, exist_ok=True)
M = os.path.join(os.path.dirname(__file__), '..', 'models')

w, h = map(int, subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', video]).decode().strip().split(','))
proc = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', video, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)

modo = vision.RunningMode.VIDEO
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(base_options=BaseOptions(model_asset_path=f'{M}/selfie_segmenter.tflite'), running_mode=modo, output_confidence_masks=True))
maos = vision.HandLandmarker.create_from_options(vision.HandLandmarkerOptions(base_options=BaseOptions(model_asset_path=f'{M}/hand_landmarker.task'), running_mode=modo, num_hands=2))
rosto = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(base_options=BaseOptions(model_asset_path=f'{M}/face_detector.tflite'), running_mode=modo))

quadros = []
i = 0
while True:
    buf = proc.stdout.read(w * h * 3)
    if len(buf) < w * h * 3:
        break
    rgb = np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    ts = int(i * 1000 / 30)

    mask = seg.segment_for_video(img, ts).confidence_masks[0].numpy_view().squeeze()
    alpha = Image.fromarray((np.clip((mask - 0.3) / 0.4, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
    pessoa = Image.fromarray(rgb).convert('RGBA')
    pessoa.putalpha(alpha)
    pessoa.save(f'{pasta}/{i:04d}.png', compress_level=1)

    r = maos.detect_for_video(img, ts)
    # Ponto de referência da mão: base do dedo médio (landmark 9)
    lista_maos = [{'x': round(lm[9].x * w), 'y': round(lm[9].y * h)} for lm in r.hand_landmarks]
    f = rosto.detect_for_video(img, ts).detections
    caixa = None
    if f:
        b = f[0].bounding_box
        caixa = {'x': b.origin_x, 'y': b.origin_y, 'w': b.width, 'h': b.height}
    quadros.append({'maos': lista_maos, 'rosto': caixa})
    i += 1

with open(saida_json, 'w') as fp:
    json.dump(quadros, fp)
print(f'{i} quadros; mãos detectadas em {sum(1 for q in quadros if q["maos"])}; rosto em {sum(1 for q in quadros if q["rosto"])}')
