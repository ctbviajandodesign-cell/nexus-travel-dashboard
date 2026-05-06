import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres el motor Nexus v3.2 de CTB Mayorista. Tu prioridad absoluta es la FIDELIDAD TOTAL.

 REGLAS ANT-RESUMEN:
- Está PROHIBIDO resumir el itinerario. Si un día tiene 2 párrafos, transcribe los 2 párrafos completos.
- Si encuentras días repetidos en el texto (ej: dos veces "Día 9"), transcribe AMBOS como bloques separados.
- No omitas ningún día. Si el programa es de 11 días, el JSON DEBE tener 11 entradas en itinerario_lista.

 REGLAS DE DETECCIÓN:
- ACTIVIDADES OPCIONALES: Busca la palabra "Opcionalmente" dentro de los días del itinerario y extráelas al campo excursiones_opcionales.
- RUTA GEOGRÁFICA: Extrae TODOS los países y ciudades mencionados en los encabezados de los días.

ESQUEMA JSON:
{
  "codigo": "", "nombre": "", "duracion_label": "", "duracion_dias": 0, "duracion_noches": 0,
  "pais_destino": "", "ciudad_destino": "", 
  "paises_visitados": "", "ciudades_visitadas": "",
  "aeropuerto_salida": "", "ciudad_salida": "", "aerolinea": "", "politica_equipaje": "",
  "comision": "", "bono_counter": "", "salidas_especificas": "", "minimo_pax": "",
  "incluye": "", "no_incluye": "", "excursiones_opcionales": "", 
  "itinerario_lista": [], "hoteles_previstos": "", "notas_importantes": "",
  "politicas_cancelacion": "", "feriados": "", "telefono_emergencia": "", "condiciones_especiales": ""
}
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Extrae CADA DETALLE de este programa. Es un circuito largo, no resumas NADA del itinerario ni de las notas:\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    if (data.itinerario_lista && Array.isArray(data.itinerario_lista)) {
      // Unimos con doble salto de línea para que sea legible en el textarea
      data.itinerario = data.itinerario_lista.join('\n\n');
    }
    return data;
  } catch (error) {
    console.error("Error en extracción:", error);
    throw error;
  }
};
