import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres el motor de extracción Nexus v3.1 de CTB Mayorista. 
Tu misión es diseccionar el documento Word con precisión quirúrgica.

 REGLAS DE EXTRACCIÓN GEOGRÁFICA:
1. CIUDAD SALIDA: Detecta GYE (Guayaquil) o UIO (Quito) y su aerolínea.
2. RUTA COMPLETA:
   - paises_visitados: Lista todos los países que toca el itinerario (ej: "Francia, Suiza, Italia").
   - ciudades_visitadas: Lista todas las ciudades donde hay actividad o pernocte (ej: "París, Lucerna, Zúrich, Roma").

 REGLAS DE ACTIVIDADES:
3. ACTIVIDADES OPCIONALES: Extrae detalladamente cualquier tour o servicio con costo adicional mencionado (ej: "Vuelo en Globo", "Cena Show", "Mixquic").

 REGLAS DE LOGÍSTICA:
4. Captura ITINERARIO ÍNTEGRO, NOTAS, FERIADOS, EQUIPAJE, COMISIÓN y BONOS.

ESQUEMA JSON:
{
  "codigo": "", "nombre": "", "duracion_label": "", "duracion_dias": 0, "duracion_noches": 0,
  "pais_destino": "", "ciudad_destino": "", 
  "paises_visitados": "", "ciudades_visitadas": "",
  "aeropuerto_salida": "", "ciudad_salida": "", "aerolinea": "", "politica_equipaje": "",
  "comision": "", "bono_counter": "", "salidas_especificas": "", "minimo_pax": "",
  "incluye": "", "no_incluye": "", "excursiones_opcionales": "", 
  "itinerario_lista": [], "hoteles_previstos": "", "notas_importantes": "",
  "politicas_cancelacion": "", "feriados": "", "telefono_emergencia": ""
}
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analiza este programa. Identifica la ciudad de salida, todos los países/ciudades visitados y todas las actividades opcionales:\n\n${text}` }
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
