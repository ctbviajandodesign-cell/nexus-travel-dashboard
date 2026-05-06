import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres un transcriptor de itinerarios turísticos para CTB Mayorista de Ecuador. 
Tu misión es TRANSCRIBIR el contenido del documento Word al JSON sin resumir NADA.

REGLAS DE EXTRACCIÓN CRÍTICAS:

1. POLÍTICAS DE CANCELACIÓN (NUEVO): 
   - Busca secciones sobre "Cancelación", "No Show", "Penalidades", "Anulaciones" o "Desistimiento".
   - Transcribe CUALQUIER REGLA de tiempo o dinero relacionada con cancelar el viaje.

2. CONDICIONES ESPECIALES:
   - Busca impuestos locales (como Room Tax), propinas obligatorias, o requisitos de visa/vacunas.

3. LOGÍSTICA AÉREA: 
   - Captura Ciudad Salida (GYE/UIO), Aero, Aerolínea y Equipaje/Farebasis.

4. ITINERARIO Y NOTAS:
   - Copia ÍNTEGRAMENTE cada día y TODA la sección de "NOTAS IMPORTANTES".

ESQUEMA JSON:
{
  "codigo": "", "nombre": "", "duracion_label": "", "duracion_dias": 0, "duracion_noches": 0,
  "pais_destino": "", "ciudad_destino": "", "aeropuerto_salida": "", "ciudad_salida": "",
  "aerolinea": "", "politica_equipaje": "", "comision": "", "vigencia_label": "",
  "incluye": "", "no_incluye": "", "cortesias_ctb": "", "notas_importantes": "",
  "politicas_cancelacion": "", "condiciones_especiales": "", "feriados": "",
  "itinerario_lista": [], "hoteles_previstos": "", "politica_ninos": ""
}
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Transcribe este documento ÍNTEGRAMENTE. No omitas las políticas de cancelación ni las condiciones especiales:\n\n${text}` }
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
