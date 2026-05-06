import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres un transcriptor de itinerarios turísticos para CTB Mayorista de Ecuador. 
Tu misión es TRANSCRIBIR el contenido del documento Word al JSON sin resumir NADA.

REGLAS DE ORO:

1. ITINERARIO (CRÍTICO): 
   - Busca bloques que empiecen con "DIA X", "DÍA X", "DIA 0X", etc.
   - DEBES extraer TODOS los días. Si el documento tiene 4 días y solo extraes 2, es un fallo crítico.
   - Copia el texto COMPLETO de cada día.

2. NOTAS IMPORTANTES:
   - Transcribe TODO el texto que aparezca bajo esta sección. No importa si es muy largo. Copia literal punto por punto.

3. CIUDAD DE SALIDA Y AEROPUERTO:
   - Busca en el texto patrones como "GYE" (Guayaquil) o "UIO" (Quito).
   - Si dice "Boleto aéreo GYE", pon ciudad_salida: "Guayaquil" y aeropuerto_salida: "GYE".

4. FERIADOS:
   - Si hay una sección de "FERIADOS", transcribe la lista completa de fechas.

5. PRECIOS: Los precios NO se extraen aquí.

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
  "vigencia_label": "",
  "incluye": "",
  "no_incluye": "",
  "cortesias_ctb": "",
  "notas_importantes": "",
  "feriados": "",
  "itinerario_lista": ["DIA 1: ...", "DIA 2: ..."],
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
        { role: "user", content: `Transcribe este documento ÍNTEGRAMENTE. No omitas ningún día del itinerario ni ninguna nota importante:\n\n${text}` }
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
