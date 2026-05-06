import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres un transcriptor de datos para CTB Mayorista. COPIA el contenido del documento al JSON sin resumir NADA.

REGLAS:
1. ITINERARIO: Copia LITERALMENTE cada día completo en la lista. Si hay 10 días, el array debe tener 10 elementos con el texto COMPLETO de cada día.
2. PRECIOS: Extrae valores numéricos de Sencilla, Doble y Triple.
3. No resumas, no parafrasees, no omitas texto.

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
  "itinerario_lista": ["Día 1: texto completo...", "Día 2: texto completo..."],
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
    console.log("Iniciando transcripción GPT-4o. Longitud del documento:", text.length, "caracteres");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Copia este documento al JSON. NO RESUMIR el itinerario:\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);

    if (data.itinerario_lista && Array.isArray(data.itinerario_lista)) {
      data.itinerario = data.itinerario_lista.join('\n\n');
      console.log(`✅ Días extraídos correctamente: ${data.itinerario_lista.length}`);
    }

    console.log("Transcripción completada:", data);
    return data;
  } catch (error) {
    console.error("Error en GPT-4o:", error);
    throw new Error("Error en la transcripción: " + error.message);
  }
};
