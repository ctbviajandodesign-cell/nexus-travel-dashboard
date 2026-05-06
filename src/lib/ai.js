import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres un transcriptor de datos para CTB Mayorista de Ecuador. Recibirás el texto de un itinerario turístico y debes copiarlo SIN RESUMIR al esquema JSON.

INSTRUCCIONES ESPECÍFICAS:

1. CÓDIGO: Busca patrones como "COD:", "CÓDIGO:" o combinaciones alfanuméricas como "3103BTSGRUST".

2. ITINERARIO: El texto tendrá bloques que empiezan con "Día 1", "DÍA 2", etc. Copia el texto COMPLETO de cada bloque en un elemento del array. Si hay 3 días, el array tendrá 3 elementos. Si hay 10 días, tendrá 10 elementos.

3. PRECIOS: Las tablas se convierten en columnas de texto. El patrón es:
   - SGL o Sencilla = precio_sencillo
   - DBL o Doble = precio_doble  
   - TPL o Triple = precio_triple
   Busca los primeros valores numéricos después de estos encabezados.

4. INCLUYE: Todo lo que esté bajo "PROGRAMA INCLUYE:", "EL PROGRAMA INCLUYE:" o similares.

5. NO INCLUYE: Todo lo que esté bajo "NO INCLUYE:" o similar.

6. NOTAS: Todo lo que esté bajo "NOTAS IMPORTANTES:" o similar.

7. HOTELES: Busca nombres de hoteles en la sección de precios.

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
    console.log("Iniciando extracción GPT-4o. Longitud:", text.length, "caracteres");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Procesa este itinerario turístico y extrae todos los datos al JSON. NO RESUMIR el itinerario:\n\n${text}` }
      ],
      temperature: 0,
      max_tokens: 16000,
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);

    // Unir lista de días en un solo string para el campo itinerario
    if (data.itinerario_lista && Array.isArray(data.itinerario_lista)) {
      data.itinerario = data.itinerario_lista.join('\n\n');
      console.log(`✅ Días extraídos: ${data.itinerario_lista.length}`);
    }

    console.log("✅ Extracción completa:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en GPT-4o:", error);
    throw new Error("Error en la extracción: " + error.message);
  }
};
