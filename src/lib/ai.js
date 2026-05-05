import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo/demo privada
});

const SYSTEM_PROMPT = `
Eres un experto en extracción de datos para CTB Mayorista (Ecuador). 
Tu tarea es leer el texto de un itinerario turístico (Word/PDF) y extraer la información en formato JSON siguiendo estrictamente este esquema.

ESQUEMA DE SALIDA (JSON):
{
  "codigo": "Código Nexus (ej: 290426/PTY-CMP/ST)",
  "nombre": "Nombre comercial del programa",
  "duracion_label": "Texto de duración (ej: 4 Días / 3 Noches)",
  "duracion_dias": 0,
  "duracion_noches": 0,
  "destino_principal": "Ciudad o país principal",
  "pais_destino": "País",
  "ciudad_destino": "Ciudad principal",
  "vigencia_label": "Texto de vigencia (ej: 10 MAR al 20 DIC 2026)",
  "incluye": "Lista de servicios incluidos (texto con viñetas)",
  "no_incluye": "Lista de servicios NO incluidos",
  "cortesias_ctb": "Seguro de viaje, Impuestos, etc.",
  "notas_importantes": "Condiciones, feriados, penalidades",
  "itinerario": "Resumen del itinerario día a día",
  "hotel_nombre": "Nombre del hotel principal (si aplica)",
  "precio_doble": 0,
  "moneda": "USD",
  "status": "borrador"
}

REGLAS CRÍTICAS:
1. Si no encuentras un campo, déjalo como null.
2. Limpia el texto de caracteres extraños.
3. Sé muy preciso con el CÓDIGO NEXUS y la VIGENCIA.
4. Devuelve ÚNICAMENTE el objeto JSON, sin explicaciones.
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Extrae la información de este programa:\n\n${text}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error en extracción IA:", error);
    throw error;
  }
};
