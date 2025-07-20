from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile
import essentia.standard as ess
import numpy as np

app = Flask(__name__)

# Autoriser uniquement certains formats
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_features(file_path):
    loader = ess.MonoLoader(filename=file_path)
    audio = loader()

    # Normalisation
    audio = ess.Normalize()(audio)

    # Découpe de segments (ici on suppose qu'on a un seul segment, mais on peut l'adapter ensuite)
    segments = [audio]  # Tu diviseras dans le JS et tu appelleras 4 fois l'API

    results = []

    for segment in segments:
        # BPM & Ticks
        rhythm_extractor = ess.RhythmExtractor2013(method="multifeature")
        bpm, ticks, _, _, _ = rhythm_extractor(segment)

        # Calcul des IBI (inter-beat intervals)
        ibis = np.diff(ticks)
        ibi_mean = float(np.mean(ibis)) if len(ibis) > 0 else 0

        # Energy
        energy = float(np.mean(np.square(segment)))

        # Onset rate
        onsets = ess.OnsetRate()(segment)

        # Spectral complexity
        sc = float(ess.SpectralComplexity()(segment))

        # Harmonicity
        harm = float(ess.Harmonicity()(segment)[0])

        # ZCR
        zcr = float(ess.ZeroCrossingRate()(segment))

        # Accent profile (simple version)
        accent_profile = []
        if len(ticks) >= 3:
            intervals = [ticks[i+1] - ticks[i] for i in range(len(ticks)-1)]
            for i in range(3):
                if i < len(intervals):
                    accent_profile.append(intervals[i])
                else:
                    accent_profile.append(0)

        # Rhythm Pattern (simplified)
        rhythm_extractor = ess.RhythmPatterns()
        rhythm_patterns, _ = rhythm_extractor(segment)
        rhythm_pattern = rhythm_patterns[0][:6].tolist()

        # Swing ratio (simplified)
        swing_ratio = ibis[1] / ibis[0] if len(ibis) >= 2 and ibis[0] > 0 else 1.0

        # MFCC
        mfcc = ess.MFCC(highFrequencyBound=8000)[0](segment)
        mfcc_profile = np.mean(mfcc, axis=0).tolist()

        # Danceability
        danceability = float(ess.Danceability()(segment)[0])

        # Beat loudness (simplified: RMS at beats)
        beat_loudness = []
        for t in ticks:
            start = int(t * 44100)
            end = start + 1024
            beat = segment[start:end]
            beat_loudness.append(float(np.sqrt(np.mean(beat ** 2))) if len(beat) > 0 else 0)
        beat_loudness = float(np.mean(beat_loudness)) if beat_loudness else 0

        # Beat histogram (simplified)
        bh = ess.BeatHistogram()(segment)
        histogram = sorted(bh.tolist(), reverse=True)[:2]

        results.append({
            "bpm": float(bpm),
            "ibi_range": [float(np.min(ibis)), float(np.max(ibis))] if len(ibis) else [0, 0],
            "energy": energy,
            "onset_rate": float(onsets),
            "spectral_complexity": sc,
            "harmonicity": harm,
            "zcr": zcr,
            "accent_profile": accent_profile,
            "rhythm_pattern": rhythm_pattern,
            "swing_ratio": swing_ratio,
            "mfcc_profile": mfcc_profile,
            "danceability": danceability,
            "beatLoudness": beat_loudness,
            "beatHistogram": histogram
        })

    # Pour l'instant on retourne juste le 1er segment
    return results[0]

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        file.save(temp.name)
        result = extract_features(temp.name)
        os.remove(temp.name)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
