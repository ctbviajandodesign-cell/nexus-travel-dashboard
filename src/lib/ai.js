import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo/demo privada
});

const SYSTEM_PROMPT = `
Eres un procesador de datos de alta fidelidad para CTB Mayorista. Tu tarea es extraer CADA DETALLE de itinerarios turísticos.

REGLAS DE EXTRACCIÓN (ESTRICTAS):
1. ITINERARIO: Debes extraer CADA DÍA por separado. Si el documento dice "Día 1" hasta "Día 15", DEBES extraer los 15 días completos. Es un error crítico resumir o agrupar días.
2. DURACIÓN: Cuenta los días reales del itinerario basándote en los bloques de texto. El número de noches debe ser (Días - 1).
3. PRECIOS: Busca las palabras "Sencilla", "Doble" y "Triple". Extrae los valores numéricos correspondientes.
4. CIUDADES: Identifica todas las ciudades visitadas y lístalas separadas por comas.
5. NO INVENTES: Si un dato no existe, déjalo como "".

ESQUEMA DE SALIDA:
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
    console.log("Iniciando extracción profunda del documento...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analiza el siguiente itinerario y extrae TODOS los campos. El itinerario debe ser íntegro:\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    console.log("Extracción completada:", data);
    return data;
  } catch (error) {
    console.error("Error en motor de IA:", error);
    throw new Error("La IA no pudo procesar este documento.");
  }
};
