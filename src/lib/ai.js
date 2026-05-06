import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// NOTA: Los precios vienen del Excel en Drive, NO del Word.
// El Word solo aporta el contenido descriptivo del programa.
const SYSTEM_PROMPT = `
Eres un transcriptor de itinerarios turísticos para CTB Mayorista de Ecuador.
Tu única tarea es extraer el CONTENIDO DESCRIPTIVO del documento Word: nombre, código, itinerario, servicios incluidos, notas y hoteles.
Los precios NO se extraen de este documento, vendrán de otra fuente.

INSTRUCCIONES:

1. CÓDIGO: Busca "COD:" o patrones alfanuméricos como "3103BTSGRUST" o "200526/IST-CLT/ST".

2. DURACIÓN: Busca texto como "10 DÍAS / 9 NOCHES" o "03 DÍAS / 02 NOCHES".

3. ITINERARIO (MUY IMPORTANTE): 
   - Busca bloques que empiecen con "Día 1", "DÍA 1", "DÍA 2", etc.
   - Copia el texto COMPLETO e ÍNTEGRO de cada día en un elemento del array.
   - Si el documento tiene 11 días, el array debe tener 11 elementos.
   - NO resumir. NO parafrasear. Copia literal.

4. INCLUYE: Todo lo que esté bajo "PROGRAMA INCLUYE:" o "EL PROGRAMA INCLUYE:".

5. NO INCLUYE: Todo lo que esté bajo "NO INCLUYE:".

6. NOTAS: Todo lo que esté bajo "NOTAS IMPORTANTES:".

7. HOTELES: Nombres de hoteles mencionados en sección "HOTELES PREVISTOS".

8. CIUDADES: Todas las ciudades visitadas según el itinerario.

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
  "vigencia_label": "",
  "incluye": "",
  "no_incluye": "",
  "cortesias_ctb": "",
  "notas_importantes": "",
  "itinerario_lista": ["Día 1: texto completo aquí", "Día 2: texto completo aquí"],
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
    console.log("Extrayendo contenido descriptivo del Word. Longitud:", text.length, "chars");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Extrae el contenido de este itinerario. COPIA el itinerario día por día SIN RESUMIR:\n\n${text}` }
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
