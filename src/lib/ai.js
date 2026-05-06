import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo/demo privada
});

const SYSTEM_PROMPT = `
Eres un extractor de datos de alta precisión para la mayorista de turismo CTB. 
Tu objetivo es leer el texto de un itinerario en Word y extraer la información REAL siguiendo este esquema JSON. 

REGLAS DE ORO:
1. NO inventes datos. Si no existe un campo en el texto, déjalo como cadena vacía "".
2. Extrae el ITINERARIO completo día por día, sin resumir excesivamente.
3. Extrae PRECIOS si aparecen (Doble, Sencilla, Triple).
4. El CÓDIGO NEXUS suele tener formato tipo "200526/IST-CLT/ST".

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
  "itinerario": "",
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
    console.log("Enviando texto a OpenAI para extracción (Longitud:", text.length, "caracteres)");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analiza este texto y extrae el JSON:\n\n${text}` }
      ],
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    console.log("Resultado de la IA:", result);
    return result;
  } catch (error) {
    console.error("Error crítico en extractProgramData:", error);
    throw error;
  }
};
