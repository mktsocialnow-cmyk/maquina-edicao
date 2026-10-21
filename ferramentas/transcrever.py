"""Transcreve a fala de um vídeo com marcação de tempo por palavra.

Uso: python3 ferramentas/transcrever.py entrada/video.mp4 [saida.json]
Gera um JSON com [{texto, inicio, fim}] por palavra, no formato do componente Legenda.
"""
import json, os, subprocess, sys, tempfile
import whisper

# Termos da marca que o modelo costuma errar; ajudam a reconhecer a grafia certa.
VOCABULARIO = 'Rafaella Carvalho, metrologia, Inmetro, ConectaMetria, radioproteção, dosimetria, Claude.'

video = sys.argv[1]
saida = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(video)[0] + '.palavras.json'

with tempfile.TemporaryDirectory() as tmp:
    audio = os.path.join(tmp, 'audio.wav')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', video, '-ar', '16000', '-ac', '1', audio], check=True)
    modelo = whisper.load_model('turbo')
    r = modelo.transcribe(audio, language='pt', word_timestamps=True, initial_prompt=VOCABULARIO)

palavras = [
    {'texto': w['word'].strip(), 'inicio': round(w['start'], 2), 'fim': round(w['end'], 2)}
    for s in r['segments'] for w in s['words']
]
with open(saida, 'w', encoding='utf-8') as f:
    json.dump(palavras, f, ensure_ascii=False, indent=1)
print(f'{len(palavras)} palavras -> {saida}')
