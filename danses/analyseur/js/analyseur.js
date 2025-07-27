import { API_BASE_URL } from "/js/config_api.js";

document.getElementById("audio-input").addEventListener("change", async function (event) {
    const output = document.getElementById("output");
    output.innerHTML = "Analyse en cours... Cela peut prendre quelques minutes. Le programme analyse 4 segments de 30 secondes également répartis sur toute votre musique.";
    const audioPlayer = document.getElementById("audioPlayer");
    const progression = document.getElementById("progression");

    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".wav")) {
        alert("Veuillez sélectionner un fichier .wav");
        return;
    }

    const fileURL = URL.createObjectURL(file);
    audioPlayer.src = fileURL;
    audioPlayer.style.display = "block";
    audioPlayer.play();
    

    const audioContext = new AudioContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const totalDuration = audioBuffer.duration;
    const segmentDuration = 15; // secondes
    const nbSegments = 7;
    const startOffset = 10; // on saute les 10 premières secondes

    const segments = [];

    for (let i = 0; i < nbSegments; i++) {
        const segmentStart = startOffset + i * ((totalDuration - startOffset) / nbSegments);
        if (segmentStart + segmentDuration > totalDuration) break;

        const startSample = Math.floor(segmentStart * audioBuffer.sampleRate);
        const endSample = Math.floor((segmentStart + segmentDuration) * audioBuffer.sampleRate);

        const segmentLength = endSample - startSample;
        const segmentBuffer = audioBuffer.getChannelData(0).slice(startSample, endSample);

        // Création d'un Buffer WAV depuis les samples
        const wavBlob = bufferToWavBlob(segmentBuffer, audioBuffer.sampleRate);
        segments.push(wavBlob);
       
    }
    segmentsResult = new Array;
     analyserSegments(segments);
});

async function analyserSegments(segments) {
    for (let i = 0; i < segments.length; i++) {
    const formData = new FormData();
    const file = new File([segments[i]], `segment${i + 1}.wav`, { type: "audio/wav" });
    formData.append("audio", file);


    try {
        const response = await fetch("${API_BASE_URL}/analyse", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        segmentsResult.push(result);
        console.log(`✅ Résultat segment ${i + 1} :`, result);





    } catch (error) {
        console.error(`❌ Erreur segment ${i + 1} :`, error);
    }
}

const fusionFinale = fusionnerSegments(segmentsResult, seuil_iqr=1);
console.log("Résultat fusionné :", fusionFinale);

//pour le moment ne sert à rien
fusionFinale.bpm_corrige = corrigerTempo(fusionFinale.bpm, fusionFinale.ibis_norm, fusionFinale.accent_profile_array, fusionFinale.bpm_histogram); // ← correction ici
console.log("bpm corrigé", fusionFinale.bpm_corrige);


//const ts = estimateTernaryFromRhythmPattern(fusionFinale.rhythm_pattern);
//fusionFinale["time_signautre"]= "ts";

const toJson = {accent_profile:fusionFinale.accent_profile, accent_profile_array:fusionFinale.accent_profile_array, bdr:fusionFinale.bdr, bpm:fusionFinale.bpm, bpm_histogram:fusionFinale.bpm_histogram, danceability:fusionFinale.danceability, energy:fusionFinale.energy, flatness:fusionFinale.flatness, ibi:fusionFinale.ibi, ibis_hist:fusionFinale.ibis_hist, ibis_norm:fusionFinale.ibis_norm, mfcc_profile:fusionFinale.mfcc_profile, onset_rate:fusionFinale.onset_rate, rp_2:fusionFinale.rp_2, rp_3:fusionFinale.rp_3, rp_6:fusionFinale.rp_6, rp_12:fusionFinale.rp_12,sc:fusionFinale.sc, swing_ratio:fusionFinale.swing_ratio, zcr:fusionFinale.zcr}

navigator.clipboard.writeText(JSON.stringify(toJson, null, 2))
  .then(() => console.log("fusionFinale copié dans le presse-papiers !"))
  .catch(err => console.error("Erreur lors de la copie :", err));

const resultComparaison = compareResultToDancesWeighted(fusionFinale, dances);
console.log(resultComparaison.length);
console.log("Danse probable :", resultComparaison[0].bestMatch.name, "avec erreur =", resultComparaison[0].bestMatch.total);
console.table(resultComparaison[0].allMatches);
for(let i =0; i< resultComparaison[0].allMatches.length; i++){
  console.log(resultComparaison[0].allMatches[i].name);
  console.log(resultComparaison[0].allMatches[i].détails)
}




function fusionnerSegments(segments) {
    const fusion = {};
    const n = segments.length;

    // Clés scalaires simples
    const scalaires = ["bdr", "energy", "flatness", "ibi", "onset_rate", "sc", "swing_ratio", "zcr",];

    scalaires.forEach(clé => {
        const valeurs = segments
            .map(seg => seg?.[clé]).filter(v => typeof v === "number");
            console.log(segments.clé);
        const filtrées = filtreIQR(valeurs, seuil=1);
        fusion[clé] = moyenne(filtrées);
    });


    // bpm (moyenne pondérée) et bpm_confidence
    const bpmMoyennePondereeBPM = bpmMoyennePonderee(segments, seuil_iqr = 0.75);
    fusion["bpm"] = bpmMoyennePondereeBPM;

    // A quoi ça sert?
    const segmentCible = segments.reduce((closest, s) => {
    return (Math.abs(s.bpm - bpmMoyennePondereeBPM) < Math.abs(closest.bpm - bpmMoyennePondereeBPM)) ? s : closest;
}, segments[0]);
    fusion["bpm_confidence"] = segmentCible.beats_confidence;
    
    // Danceability avec moyenne pondérée sur danceability confidence
    fusion["danceability"] = danceabilityMoyennePonderee(segments, seuil_iqr = 1);
    
    //bpmHIstogram
    fusion["bpm_histogram"] = fusionnerBpmHistogram(segments, seuil_iqr = 1);

    // Moyenne des vecteurs
    const vecteurs = ["accent_profile", "accent_profile_array", "rp_2","rp_3","rp_6", "rp_12", "mfcc_profile", "ibis_norm", "ibis_hist"];
    vecteurs.forEach(key => {
        const arrays = segments
          .map(s => s[key])
          .filter(a => Array.isArray(a) && a.every(v => typeof v === "number"));
        const alignés = tronquerArrays(arrays);
        const filtrés = filtreIQRarray(alignés, seuil_iqr = 1);
        fusion[key] = moyenneVecteurs(filtrés);
    });

  
  
  
    return fusion;
}

}

// Fonctions utilitaires pour la fusion

function bpmMoyennePonderee(segments , seuil_iqr) {     
    const valeursBpm = [];
    
    for (const s of segments) {
      if (typeof s.bpm === "number") {
      valeursBpm.push(s.bpm);
      
    }
  }
  const segmentsConservés = [segments.map(s => ({ bpm: s.bpm, beats_confidence: s.beats_confidence ?? 1 }))];

  const minValeurs = Math.min(...valeursBpm);
  const maxValeurs = Math.max(...valeursBpm);

  if(maxValeurs - minValeurs > 30){
    const segmentsConservés = [];
    const indicesMin = valeursBpm
  .map((v, i) => v - minValeurs < 15 ? i : -1)
  .filter(i => i !== -1);
    const indicesMax = valeursBpm
  .map((v, i) => maxValeurs - v < 15 ? i : -1)
  .filter(i => i !== -1);

  const prochesMin = indicesMin.length;
  const prochesMax = indicesMax.length;

  

    if(prochesMin> 2 && prochesMin<5){
      segmentsConservés.push(indicesMin.map(i => segments[i]));
      segmentsConservés.push(indicesMax.map(i => segments[i]));
      console.log("🟰 Deux groupes conservés (min et max)", segmentsConservés);
    }
    else{

    const indicesMajoritaires = prochesMin >= prochesMax ? indicesMin : indicesMax;
    segmentsConservés.push(indicesMajoritaires.map(i => segments[i]));
    console.log("✅ Groupe majoritaire conservé", segmentsConservés);
    }
  }
 

  const resultatsGroupes = [];

  for (const groupe of segmentsConservés) {
  const valeurs = groupe.map(s => s.bpm);
  const poids = groupe.map(s => s.beats_confidence ?? 1);


  const indicesConservés = filtreIQRScalairesPondérés(valeurs, poids, seuil_iqr);

  const bpmMoyenPondéré = moyennePondérée(indicesConservés.valeurs, indicesConservés.poids);
  const sommePoids = indicesConservés.poids.reduce((a, b) => a + b, 0);
  const poidsMoyen = sommePoids / indicesConservés.poids.length;

  resultatsGroupes.push({
    bpm: bpmMoyenPondéré,
    poids: poidsMoyen
  });
  }

  
  

  return resultatsGroupes;
}

function danceabilityMoyennePonderee(segments, seuil_iqr) {
  const danceability_data = segments.map(s => s.danceability);
  const confidence = segments.map(s => Array.isArray(s.danceability_confidence)
  ? moyenne(s.danceability_confidence)
  : 1);

  const indicesConservés = filtreIQRScalairesPondérés(danceability_data, confidence, seuil_iqr);
  
  const danceability = moyennePondérée(indicesConservés.valeurs, indicesConservés.poids); // à condition de récupérer aussi les poids filtrés
  const poids = moyenne(indicesConservés.poids);
  return {danceability, poids};
}



function fusionnerBpmHistogram(segments, seuil_iqr) {
  // Extraire tous les histos : segments[i][key] doit exister et être un tableau
  const bpmHistograms = segments
    .map(seg => seg['bpm_histogram'])
    .filter(arr => Array.isArray(arr) && arr.length >= 8); // sécurité
  
  if (bpmHistograms.length === 0) {
    return { bpmGrid: [], mergedHistogram: [] };
  }

  // Grille BPM (même pour tous normalement)
  const bpmGrid = bpmHistograms[0][4];

  // Collecte des amplitudes
  let amplitudesList = bpmHistograms.map(h => h[7]);


    const filteredAmplitudes = [];

    for (let i = 0; i < bpmGrid.length; i++) {
      const valuesAtIndex = amplitudesList.map(arr => arr[i]);
      const filtered = filtreIQR(valuesAtIndex, seuil_iqr);
      filteredAmplitudes.push(filtered);
    }

    // Reconstituer par segment
    amplitudesList = amplitudesList.map((_, segIdx) =>
      bpmGrid.map((_, i) => filteredAmplitudes[i][segIdx] ?? 0)
    );


  // Normaliser chaque histogramme
  amplitudesList = amplitudesList.map(normalizeHistogram);

  // Fusion par moyenne simple
  const mergedHistogram = bpmGrid.map((_, i) => {
    let sum = 0;
    for (let j = 0; j < amplitudesList.length; j++) {
      sum += amplitudesList[j][i];
    }
    return sum / amplitudesList.length;
  });

  return mergedHistogram;
}





// Fonction de comparaison pondérée
function compareResultToDancesWeighted(result, dances) {

  const errors = [];
  const err = [];
  const total = [];
  const detailedErrors = [];
  const totalError = []; 
  const errEntries = []; 
    
    for(let i =0; i < result.bpm.length; i++)
    {
      
    errors[i] = dances.map(dance => { 
      detailedErrors[dance.name] = [];
       totalError[dance.name] = [];
      total[i] = 0;
      err[i] = [];
      errEntries[i] = [];
    err[i].bdr = weights[dance.name]["bdr_range"] * normalizeRangeError(result.bdr, dance.bdr_range);
    err[i].bdr_mean = weights[dance.name]["bdr_mean"] * Math.abs(result.bdr - dance.bdr_mean);
    err[i].bpm = weights[dance.name]["bpm_range"]*(result.bpm[i]["poids"]/10) * normalizeRangeError(result.bpm[i]["bpm"], dance.bpm_range);
    err[i].bpm_mean = weights[dance.name]["bpm_mean"]*(result.bpm[i]["poids"]/10)* Math.abs(result.bpm[i]["bpm"] - dance.bpm_mean);
    err[i].danceability = weights[dance.name]["danceability_range"] *result.danceability["poids"]*normalizeRangeError(result.danceability["danceability"], dance.danceability_range);
    err[i].danceability_mean = weights[dance.name]["danceability_mean"]*result.danceability["poids"] * Math.abs(result.danceability["danceability"] - dance.danceability_mean);
    err[i].energy = weights[dance.name]["energy_range"] * normalizeRangeError(result.energy, dance.energy_range);
    err[i].energy_mean = weights[dance.name]["energy_mean"] * Math.abs(result.energy - dance.energy_mean);
    err[i].flatness = weights[dance.name]["flatness_range"] * normalizeRangeError(result.flatness, dance.flatness_range);
    err[i].flatness_mean = weights[dance.name]["flatness_mean"] * Math.abs(result.flatness - dance.flatness_mean);
    err[i].ibi = weights[dance.name]["ibi_range"] * normalizeRangeError(result.ibi, dance.ibi_range);
    err[i].ibi_mean = weights[dance.name]["ibi_mean"] * Math.abs(result.ibi - dance.ibi_mean);
    err[i].onset_rate = weights[dance.name]["onset_rate_range"] * normalizeRangeError(result.onset_rate, dance.onset_rate_range);
    err[i].onset_rate_mean = weights[dance.name]["onset_rate_mean"] * Math.abs(result.onset_rate - dance.onset_rate_mean);
    err[i].sc = weights[dance.name]["sc_range"] * normalizeRangeError(result.sc, dance.sc_range);
    err[i].sc_mean = weights[dance.name]["sc_mean"] * Math.abs(result.sc - dance.sc_mean);
    err[i].swing_ratio = weights[dance.name]["swing_ratio_range"] * normalizeRangeError(result.swing_ratio, dance.swing_ratio_range);
    err[i].swing_ratio_mean = weights[dance.name]["swing_ratio_mean"] * Math.abs(result.swing_ratio - dance.swing_ratio_mean);
    err[i].zcr = weights[dance.name]["zcr_range"] * normalizeRangeError(result.zcr, dance.zcr_range);
    err[i].zcr_mean = weights[dance.name]["zcr_mean"] * Math.abs(result.zcr - dance.zcr_mean);
    
    
    err[i].accent_profile = weights[dance.name]["accent_profile"] * cosineSimilarity(result.accent_profile, dance.accent_profile);
    err[i].accent_profile_array = weights[dance.name]["accent_profile_array"] * cosineSimilarity(result.accent_profile_array, dance.accent_profile_array);
    err[i].bpm_histogram = weights[dance.name]["bpm_histogram"] * cosineSimilarity(result.bpm_histogram, dance.bpm_histogram);
    err[i].ibis_norm = weights[dance.name]["ibis_norm"] * cosineSimilarity(result.ibis_norm, dance.ibis_norm);
    err[i].ibis_hist = weights[dance.name]["ibis_hist"] * cosineSimilarity(result.ibis_hist, dance.ibis_hist);
    err[i].mfcc_profile = weights[dance.name]["mfcc_profile"] * cosineSimilarity(result.mfcc_profile, dance.mfcc_profile);
    err[i].rp_2 = weights[dance.name]["rp_2"] * cosineSimilarity(result.rp_2, dance.rp_2);
    err[i].rp_3 = weights[dance.name]["rp_3"] * cosineSimilarity(result.rp_3, dance.rp_3);
    err[i].rp_6 = weights[dance.name]["rp_6"] * cosineSimilarity(result.rp_6, dance.rp_6);
    err[i].rp_12 = weights[dance.name]["rp_12"] * cosineSimilarity(result.rp_12, dance.rp_12);
    
    // Time signature : pénalité fixe
    
    //if (dance.time_signature !== result.time_signature) {
    //  err[i].time_signature =  weights[dance.name]["time_signature"] * 1; // pénalité 1 (à ajuster)
    //}

    total[i] = Object.values(err[i]).reduce((a, b) => a + b, 0);
    total[i] = Math.round(total[i]*1000)/1000;
    totalError[dance.name][i] = total[i];
    detailedErrors[dance.name][i] = Object.entries(err[i]).sort((a, b) => b[1] - a[1]);
    totalError[dance.name][i] = total[i];

    return {name: dance.name, total: totalError[dance.name][i], détails: detailedErrors[dance.name][i]};

    }

      
  );}

  const resultatComparaison = [];

  for(let i=0; i< errors.length; i++)
  {
    errors[i] = errors[i].sort((a, b) => a.total - b.total);
     
    resultatComparaison.push({bestMatch: errors[i][0], allMatches: errors[i]})
  return resultatComparaison;
    }
}


// Fonctions utilitaires pour la comparaison

function normalizeRangeError(value, range) {
  if (value < range[0]) return (range[0] - value) / (range[1] - range[0]);
  if (value > range[1]) return (value - range[1]) / (range[1] - range[0]);
  return 0;
}

function cosineSimilarity(v1, v2) {
  const len = Math.min(v1.length, v2.length);
  if (len === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += v1[i] * v2[i];
    normA += v1[i] * v1[i];
    normB += v2[i] * v2[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  result =  dotProduct / denominator; // Résultat entre 0 (très différent) et 1 (identique)
  return 1 - result
}


//Non utilisé pour le moment
function corrigerTempo(bpm, ibi = [], beatLoudness = [], time_signature = null, bpmHistogram = []) {
  if (bpm >= 40) return bpm; // Pas besoin de corriger

  const ibiMedian = ibi.length ? ibi.sort((a, b) => a - b)[Math.floor(ibi.length / 2)] : null;
  const beatCount = beatLoudness.length;

  const hasVerySlowIBI = ibiMedian && ibiMedian > 1.5; // en secondes
  const hasFewBeats = beatCount < 10;

  // Cherche s'il existe un pic dans le bpmHistogram proche de bpm*2 ou bpm*3
  const bpmAltCandidates = [bpm * 2, bpm * 3];
  const histogramPeaks = bpmHistogram?.[1] || [];

  const peakNear = (target) =>
    histogramPeaks.find(val => Math.abs(val - target) < 5);

  if (hasVerySlowIBI || hasFewBeats || bpm === 30) {
    if (peakNear(bpm * 3) || time_signature === "3/4") return bpm * 3;
    if (peakNear(bpm * 2)) return bpm * 2;
  }

  return bpm;
}

//Utilitaires mathématiques pour la fusion

function filtreIQRarray(arrays, seuil) {
  const scores = arrays.map(a => a.reduce((sum, v) => sum + v * v, 0)); // norme² simple
  const sorted = [...scores].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const min = q1 - seuil * iqr;
  const max = q3 + seuil * iqr;

  return arrays.filter((a, i) => scores[i] >= min && scores[i] <= max);
}

function filtreIQR(valeurs, seuil) {
  const sorted = [...valeurs].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const min = q1 - seuil * iqr;
  const max = q3 + seuil * iqr; 
  return valeurs.filter(v => v >= min && v <= max);
}

function filtreIQRScalairesPondérés(valeurs, poids, seuil) {
  if (!valeurs || !poids || valeurs.length !== poids.length) {
    throw new Error("Longueur des valeurs et des poids incohérente");
  }

  const data = valeurs.map((v, i) => ({ v, p: poids[i], i }));
  
  // 1. Calcul du IQR sur les valeurs SEULEMENT
  const sortedVals = [...valeurs].sort((a, b) => a - b);
  const q1 = sortedVals[Math.floor(sortedVals.length * 0.25)];
  const q3 = sortedVals[Math.floor(sortedVals.length * 0.75)];
  const iqr = q3 - q1;
  const min = q1 - seuil * iqr;
  const max = q3 + seuil * iqr;

  // 2. Filtrer les indices valides (pas des outliers dans valeurs)
  const filtrés = data.filter(d => d.v >= min && d.v <= max);

      return {
      valeurs: filtrés.map(d => d.v),
      poids: filtrés.map(d => d.p)
    };
}

function linearInterpolate(x, y, xNew) {
  const yNew = [];
  let i = 0;
  for (const xVal of xNew) {
    while (i < x.length - 2 && x[i+1] < xVal) {
      i++;
    }
    const x0 = x[i], x1 = x[i+1];
    const y0 = y[i], y1 = y[i+1];
    const t = (xVal - x0) / (x1 - x0);
    yNew.push(y0 + t * (y1 - y0));
  }
  return yNew;
}

function normalizeHistogram(y) {
  const sum = y.reduce((a,b) => a + b, 0);
  return sum === 0 ? y : y.map(v => v / sum);
}



function moyenne(valeurs) {
  if (!valeurs.length) return null;
  const sum = valeurs.reduce((a, b) => a + b, 0);
  return sum / valeurs.length
}

function moyennePondérée(valeurs, poids) {
  if (!valeurs.length || valeurs.length !== poids.length) return null;

  const totalPoids = poids.reduce((a, b) => a + b, 0);
  if (totalPoids === 0) return null;
  const somme = valeurs.reduce((acc, val, i) => acc + val * poids[i], 0);
  return somme / totalPoids
}

function tronquerArrays(arrays) {
  const minLen = Math.min(...arrays.map(arr => arr.length));
  return arrays.map(arr => arr.slice(0, minLen));
}

function moyenneVecteurs(arrays) {
  if (!arrays.length) return [];
  const len = arrays[0].length;
  const somme = new Array(len).fill(0);
  arrays.forEach(arr => {
    arr.forEach((v, i) => {
      somme[i] += v;
    });
  });
  return somme.map(v => v / arrays.length)
}






function estimateTernaryFromIBIs(ibis) {

  if (!ibis || ibis.length < 3) return { ternary: false, confidence: 0 };
  function std(arr) {
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}
  const ratios = [];
  const ternaryLikeGroups = []; //Variance
  for (let i = 0; i < ibis.length - 2; i += 3) {
  const group = [ibis[i], ibis[i+1], ibis[i+2]];
  const sum = group.reduce((a, b) => a + b, 0);
  const norm = group.map(x => x / sum); // proportions
  ratios.push(norm);
  if (std(group) < 0.01) {
    ternaryLikeGroups.push(group);
  }
  }
   const ternaryCandidates = [];
for (let i = 0; i < ibis.length - 2; i += 3) {
  const r1 = ibis[i+1] / ibis[i];
  const r2 = ibis[i+2] / ibis[i+1];
  if (Math.abs(r1 - 1) < 0.01 && Math.abs(r2 - 1) < 0.01) {
    ternaryCandidates.push([ibis[i], ibis[i+1], ibis[i+2]]);
  }
}

const confidenceVariance = ternaryLikeGroups.length / ratios.length;

const confidence = ternaryCandidates.length / ratios.length;
 //console.log("Near triple1:", ternaryCandidates.length, "confidence:", confidence, "Near triple2", ternaryLikeGroups.length, "confidence:", confidence);
  return {
    ternary: confidence > 0.4,
    confidence: Math.round(confidence * 100) / 100,
    details: { candidate_count: ternaryCandidates.length, total: ratios.length }
  };
}

function findTopPeaks(arr, count, threshold) {
  const peaks = [];

  if(arr[0] > arr[1] && arr[0]>threshold)
  {
    peaks.push({ index: 0, value: arr[0] });
  }

  for (let i = 1; i < arr.length - 1; i++) {
    const left = arr[i - 1];
    const center = arr[i];
    const right = arr[i + 1];

    if ((center - left > 0) && (center - right > 0) && (center > threshold)) {
      peaks.push({ index: i, value: center });
    }
  }

  if (arr[arr.length - 1] - arr[arr.length - 2] > 0 && arr[arr.length - 1] > threshold) {
  peaks.push({ index: arr.length - 1, value: arr[arr.length - 1] });
}
  // Tri par intensité décroissante puis on garde les meilleurs
  peaks.sort((a, b) => b.value - a.value);
  const top = peaks.slice(0, count);

  // Puis on trie par position croissante pour avoir des ratios cohérents
  return top.sort((a, b) => a.index - b.index);
}


function findTopPeaksRP(arr, count, maxIndex, threshold) {
  const peaks = [];

    for (let i = 1; i < arr.length - 1; i++) {
    const left = arr[i - 1];
    const center = arr[i];
    const right = arr[i + 1];

    if ((center - left > 0) && (center - right > 0) && (arr[maxIndex]- center < threshold)) {
      peaks.push({ index: i, value: center });
    }
  }

  if (arr[arr.length - 1] - arr[arr.length - 2] > 0 && arr[maxIndex]- [arr.length - 1] < threshold) {
  peaks.push({ index: arr.length - 1, value: arr[arr.length - 1] });
}
  // Tri par intensité décroissante puis on garde les meilleurs
  peaks.sort((a, b) => b.value - a.value);
  const top = peaks.slice(0, count);

  // Puis on trie par position croissante pour avoir des ratios cohérents
  return top.sort((a, b) => a.index - b.index);
}



function estimateTernaryFromRhythmPattern(rhythm_pattern) {
  console.log(rhythm_pattern);
  let result = {"rythme:": 0, "confidence:": 0};
  const max = Math.max(...rhythm_pattern.slice(1));
  const maxIndex = rhythm_pattern.indexOf(max);
  const threshold = 0.2;

  const peaks = findTopPeaksRP(rhythm_pattern, 2, maxIndex, threshold);
  console.log(peaks);
  
  let ternaryAligned = 0;
  let binaryAligned = 0;

  for (let i = 0; i < peaks.length; i++) {
    const index = peaks[i].index;


      if (index % 3 === 0) {
        ternaryAligned += 1;
      } else if (index % 2 === 0) {
        binaryAligned += 1;
      }
    }


  const ternaryConfidence = ternaryAligned / peaks.length;
  const binaryConfidence = binaryAligned / peaks.length;

  if (ternaryConfidence > binaryConfidence && ternaryConfidence > 0.5) {
    result= { form: "ternary", confidence: ternaryConfidence };
  } else if (binaryConfidence > ternaryConfidence && binaryConfidence > 0.5) {
    result= { form: "binary", confidence: binaryConfidence };
  } else {
    result= "ambiguous"; 
  }
  console.log(result);
  return result;

}


function estimateTernaryFromAccentProfile(accent_profile_array) {
 let result = {"rythme:": 0, "confidence:": 0};
  // Debug
  const max = Math.max(...accent_profile_array);
  const min = Math.min(...accent_profile_array);
  const mean = accent_profile_array.reduce((sum, val) => sum + val, 0) / accent_profile_array.length;
  const std = Math.sqrt(accent_profile_array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / accent_profile_array.length);
  //console.log(accent_profile_array);  //console.log("max", max, "std", std, "max-min", max-min);
 const threshold = max-10*(max-min)*std*std;
 //console.log(10*std*std, (max-min)*std*std);
  const peaks = findTopPeaks(accent_profile_array, 10, threshold); // ou autre valeur
  //console.log(peaks);
  if(peaks.length >2){
 let ternaryAligned = 0;
  let binaryAligned = 0;
let distances = [];
for (let i = 1; i < peaks.length; i++) {
  const distance = peaks[i].index - peaks[i - 1].index;
distances.push(distance);  
if (distance % 3 === 0) {
    ternaryAligned += 1;
  }
  if (distance % 2 === 0) {
    binaryAligned += 1;
  }
}
//console.log(distances);

const totalDistances = peaks.length - 1;
const confidenceBinary = totalDistances > 0 ? binaryAligned / totalDistances : 0;
const confidenceTernary = totalDistances > 0 ? ternaryAligned / totalDistances : 0;
//console.log("ternary:", ternaryAligned, confidenceTernary);
//console.log("binary:", binaryAligned, confidenceBinary);
if(ternaryAligned > binaryAligned && confidenceTernary > 0.66){
  result = {"rythme:": 3 , "confidence:": confidenceTernary};
}
else if (ternaryAligned < binaryAligned && confidenceBinary > 0.66){
  result = {"rythme:": 2 , "confidence:": confidenceBinary};
}
else{
   result = {"rythme:": 0, "confidence:": 0};
}
  }



    //console.log("AccentProfile", result);
  return result;

}


function combineTernaryDetections(...estimations) {
 
  
  
  
  
  let ternaryVotes = 0;
  let totalConfidence = 0;
  let sumConfidence = 0;
  const details = [];

  for (const e of estimations) {
    if (!e || typeof e.confidence !== "number") continue;

    if (e.ternary) {
      ternaryVotes += e.confidence;
    } else {
      ternaryVotes -= e.confidence;
    }
    sumConfidence += Math.abs(e.confidence);
    totalConfidence += e.confidence;
    details.push(e);
  }

  const overallConfidence = Math.abs(ternaryVotes) / (sumConfidence || 1);
  const ternary = ternaryVotes > 0;

  return {
    ternary,
    confidence: Math.round(overallConfidence * 1000) / 1000,
    details
  };
}






// === Fonction utilitaire d'initialiation : transforme Float32Array en WAV Blob (mono) ===
function bufferToWavBlob(buffer, sampleRate) {
    const wavBuffer = encodeWav(buffer, sampleRate);
    return new Blob([wavBuffer], { type: "audio/wav" });
}

function encodeWav(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    const numChannels = 1;
    const bitsPerSample = 16;

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true);  // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true);
    view.setUint16(32, numChannels * bitsPerSample / 8, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    // PCM 16-bit
    for (let i = 0; i < samples.length; i++) {
        let s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return view;
}
