import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo/demo privada
});

const SYSTEM_PROMPT = `
Eres un extractor de datos de alta precisión para CTB Mayorista. 
Recibirás el contenido de un itinerario en formato HTML. Tu misión es convertirlo en JSON.

REGLAS CRÍTICAS:
1. DURACIÓN: Cuenta físicamente cuántos días aparecen en el itinerario (Día 1, Día 2...). Pon ese número en "duracion_dias" y (días - 1) en "duracion_noches".
2. ITINERARIO: Extrae el texto COMPLETO de cada día. No resumas. 
3. CIUDADES: Lista todas las ciudades mencionadas en el itinerario separadas por comas en "ciudad_destino".
4. PRECIOS: Busca tablas de precios y extrae los valores para Sencilla, Doble y Triple.
5. NO inventes datos. Si no existe, "".

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
