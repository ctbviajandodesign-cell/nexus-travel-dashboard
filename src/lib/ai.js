import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo/demo privada
});

const SYSTEM_PROMPT = `
Eres un experto en extracción de datos para CTB Mayorista. Tu tarea es convertir itinerarios turísticos en JSON estructurado.

ESQUEMA EXTENDIDO:
{
  "codigo": "Código Nexus (ej: 290426/PTY-CMP/ST)",
  "nombre": "Nombre comercial del programa",
  "duracion_label": "Texto duración (ej: 4 Días / 3 Noches)",
  "duracion_dias": 0,
  "duracion_noches": 0,
  "destino_principal": "Ciudad o país principal",
  "pais_destino": "País",
  "ciudad_destino": "Ciudad",
  "vigencia_label": "Vigencia (ej: Ene a Dic 2026)",
  "incluye": "Servicios incluidos detallados",
  "no_incluye": "Lo que no incluye",
  "cortesias_ctb": "Seguro, impuestos, chips, etc.",
  "notas_importantes": "Condiciones y penalidades",
  "itinerario": "Itinerario día por día detallado",
  "politica_ninos": "Edades y condiciones para niños",
  "hoteles_previstos": "Lista de hoteles mencionados",
  "precio_doble": 0,
  "moneda": "USD",
  "status": "borrador"
}

REGLAS:
- Si el texto dice "3 noches", pon 3 en duracion_noches.
- Extrae TODO el itinerario, no lo resumas demasiado.
- En cortesias_ctb busca seguros de viaje o bonos.
- Devuelve solo JSON.
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
