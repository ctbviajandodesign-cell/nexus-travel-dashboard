import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// NOTA: Los precios vienen del Excel en Drive, NO del Word.
// El Word aporta el contenido descriptivo y la logística del programa.
const SYSTEM_PROMPT = `
Eres un transcriptor de itinerarios turísticos para CTB Mayorista de Ecuador.
Extrae el CONTENIDO DESCRIPTIVO y LOGÍSTICO del documento Word.
Los precios NO se extraen aquí, vendrán de otra fuente.

INSTRUCCIONES DETALLADAS:

1. CÓDIGO: Busca "COD:" seguido del código. Ej: "COD: 0604FLNBCWST" → "0604FLNBCWST"

2. DURACIÓN: Busca "X DÍAS / Y NOCHES" o "X DÍAS – Y NOCHES".

3. CIUDAD DE SALIDA (MUY IMPORTANTE):
   Busca en la sección "INCLUYE" el boleto aéreo. El patrón es:
   "Boleto aéreo GYE – XXX – GYE" → ciudad_salida = "Guayaquil", aeropuerto_salida = "GYE"
   "Boleto aéreo UIO – XXX – UIO" → ciudad_salida = "Quito", aeropuerto_salida = "UIO"
   Si no hay vuelo incluido, deja estos campos vacíos.

4. AEROLÍNEA: Busca "VIA LATAM", "VIA AVIANCA", etc. en la línea del boleto aéreo.

5. ITINERARIO (MUY IMPORTANTE):
   Busca bloques "DÍA 1", "DÍA 2", etc. Copia el texto COMPLETO e ÍNTEGRO de cada día.
   Si hay 11 días → 11 elementos en el array. NO resumir. Copia literal.

6. INCLUYE: Todo bajo "PROGRAMA INCLUYE:". Incluye emojis y todo el texto.

7. NO INCLUYE: Todo bajo "NO INCLUYE:".

8. NOTAS: Todo bajo "NOTAS IMPORTANTES:". Incluye feriados si aparecen.

9. HOTELES: Nombres en "HOTELES PREVISTOS" organizados por ciudad.

10. CIUDADES DESTINO: Todas las ciudades del itinerario separadas por coma.

11. VIGENCIA: Fechas de validez del programa si aparecen.

12. FERIADOS: Lista de fechas de feriado/suplemento si existe esa sección.

ESQUEMA JSON DE SALIDA:
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
  "aeropuerto_salida": "",
  "ciudad_salida": "",
  "aerolinea": "",
  "vigencia_label": "",
  "incluye": "",
  "no_incluye": "",
  "cortesias_ctb": "",
  "notas_importantes": "",
  "feriados": "",
  "itinerario_lista": ["DÍA 1: texto completo aquí", "DÍA 2: texto completo aquí"],
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
    console.log("Extrayendo contenido del Word. Longitud:", text.length, "chars");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Extrae todos los datos de este itinerario. COPIA el itinerario día por día SIN RESUMIR. Detecta la ciudad de salida (GYE/UIO):\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);

    // Unir lista de días en un solo texto para el campo itinerario
    if (data.itinerario_lista && Array.isArray(data.itinerario_lista)) {
      data.itinerario = data.itinerario_lista.join('\n\n');
      console.log(`✅ Días extraídos: ${data.itinerario_lista.length}`);
    }

    console.log("✅ Extracción completada:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en extracción:", error);
    throw new Error("Error procesando el documento: " + error.message);
  }
};
