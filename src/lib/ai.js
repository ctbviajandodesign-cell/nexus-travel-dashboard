import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo/demo privada
});

const SYSTEM_PROMPT = `
Eres un transcriptor de datos de alta fidelidad para CTB Mayorista. Tu misión es TRANSCRIBIR el contenido de itinerarios turísticos sin omitir información.

REGLAS DE ORO:
1. ITINERARIO: Extrae el itinerario como una LISTA DE DÍAS. Cada elemento de la lista debe ser el contenido ÍNTEGRO de ese día. NO RESUMAS. Si el documento dice 500 palabras para el Día 1, transcribe las 500 palabras.
2. PRECIOS: Busca tablas y extrae los valores numéricos para Sencilla, Doble y Triple.
3. CIUDADES: Identifica todas las ciudades visitadas.

ESQUEMA JSON:
{
  "codigo": "",
  "nombre": "",
  "duracion_label": "",
  "duracion_dias": 0,
  "duracion_noches": 0,
  "tipo_operacion": "",
  "destino_principal": "",
  "pais_destino": "",
  "ciudad_destino": "",
  "vigencia_label": "",
  "incluye": "",
  "no_incluye": "",
  "cortesias_ctb": "",
  "notas_importantes": "",
  "itinerario_lista": ["Día 1: ...", "Día 2: ..."],
  "hoteles_previstos": "",
  "politica_ninos": "",
  "precio_doble": 0,
  "precio_sencillo": 0,
  "precio_triple": 0,
  "moneda": "USD"
}
`;

export const extractProgramData = async (text) => {
  try {
    console.log("Iniciando transcripción con GPT-4o...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Usamos el modelo más potente para evitar resúmenes
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Transcribe íntegramente este itinerario al formato JSON:\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    
    // Convertimos la lista de vuelta a string para que el Dashboard no falle
    if (data.itinerario_lista) {
      data.itinerario = data.itinerario_lista.join('\n\n');
    }
    
    console.log("Transcripción completada.");
    return data;
  } catch (error) {
    console.error("Error en motor GPT-4o:", error);
    throw new Error("Error en la transcripción.");
  }
};
