import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres el motor Nexus v3.5 de CTB Mayorista. Tu misión es la EXTRACCIÓN TOTAL sin pérdida de datos.

ESTRATEGIA DE EXTRACCIÓN FLEXIBLE:
1. IDENTIFICACIÓN DE BLOQUES: No busques solo etiquetas fijas. Identifica cualquier título o sección relevante (en negrita, subrayado o con viñetas).
2. CLASIFICACIÓN INTELIGENTE:
   - "Penalidades/Anulaciones/Desistimientos" -> politicas_cancelacion.
   - "Equipaje/Vuelos/Farebasis/Aerolínea" -> Secciones aéreas.
   - "Pickups/Horarios/Columnas" -> informacion_traslados.
3. RED DE SEGURIDAD (info_tecnica_adicional): 
   - SI ENCUENTRAS CUALQUIER OTRA SECCIÓN que no encaje perfectamente en los campos estándar (ej: "Room Tax", "Kit de viaje", "Responsabilidades"), transcríbela íntegramente en este campo. 
   - NUNCA descartes información.

REGLAS DE ORO:
- Transcripción LITERAL (mínimo 95% de coincidencia con el texto original).
- Mantener el orden del itinerario.
- Limpiar precios para que sean solo números en los campos de precio.

ESQUEMA JSON:
{
  "codigo": "", "nombre": "", "duracion_label": "", "duracion_dias": 0, "duracion_noches": 0,
  "pais_destino": "", "ciudad_destino": "", "paises_visitados": "", "ciudades_visitadas": "",
  "aeropuerto_salida": "", "ciudad_salida": "", "aerolinea": "", "politica_equipaje": "",
  "comision": "", "bono_counter": "", "salidas_especificas": "", "minimo_pax": "",
  "incluye": "", "no_incluye": "", "excursiones_opcionales": "", 
  "itinerario_lista": [], "hoteles_previstos": "", "notas_habitacion": "", "politica_ninos": "",
  "politicas_cancelacion": "", "feriados": "", "telefono_emergencia": "", 
  "info_tecnica_adicional": "", "notas_importantes": "", "condiciones_especiales": ""
}
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analiza este programa y extrae CADA BLOQUE de información. No resumas nada. Si hay datos raros o nuevos, ponlos en 'info_tecnica_adicional':\n\n${text}` }
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
