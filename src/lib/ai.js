import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres un transcriptor de itinerarios turísticos para CTB Mayorista de Ecuador. 
Tu misión es TRANSCRIBIR el contenido del documento Word al JSON sin resumir NADA.

REGLAS DE EXTRACCIÓN:

1. LOGÍSTICA AÉREA: 
   - Busca "GYE" o "UIO" para ciudad_salida y aeropuerto_salida.
   - Busca "VIA LATAM", "VIA AVIANCA", etc. para aerolinea.
   - Busca "FAREBASIS" y detalles de "EQUIPAJE" (23kg, mano, etc.) para politica_equipaje.

2. FINANZAS:
   - Busca "COMISIÓN FIJA" para extraer el valor en el campo comision.

3. ITINERARIO:
   - Copia ÍNTEGRAMENTE cada día (DIA 1, DIA 2, etc.). NO resumas.

4. NOTAS Y FERIADOS:
   - Transcribe TODA la sección de "NOTAS IMPORTANTES" y "FERIADOS".

ESQUEMA JSON:
{
  "codigo": "",
  "nombre": "",
  "duracion_label": "",
  "duracion_dias": 0,
  "duracion_noches": 0,
  "pais_destino": "",
  "ciudad_destino": "",
  "aeropuerto_salida": "",
  "ciudad_salida": "",
  "aerolinea": "",
  "politica_equipaje": "",
  "comision": "",
  "vigencia_label": "",
  "incluye": "",
  "no_incluye": "",
  "cortesias_ctb": "",
  "notas_importantes": "",
  "feriados": "",
  "itinerario_lista": [],
  "hoteles_previstos": "",
  "politica_ninos": ""
}
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Transcribe este documento sin omitir nada. Captura la comisión, equipaje, itinerario completo y todas las notas:\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    if (data.itinerario_lista && Array.isArray(data.itinerario_lista)) {
      data.itinerario = data.itinerario_lista.join('\n\n');
    }
    return data;
  } catch (error) {
    console.error("Error en extracción:", error);
    throw error;
  }
};
