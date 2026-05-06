import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
Eres el motor de extracción de datos de CTB Mayorista (Nexus AI). 
Tu misión es diseccionar el documento Word y extraer CADA detalle logístico en su campo correspondiente.

 CAMPOS LOGÍSTICOS DETALLADOS:

1. SALIDAS Y FECHAS:
   - salidas_especificas: Lista de fechas exactas (ej: "Oct 06, 13, 27").
   - vigencia_label: Rango general de validez.

2. LOGÍSTICA AÉREA Y TRASLADOS:
   - aeropuerto_salida / ciudad_salida / aerolinea / politica_equipaje.
   - informacion_traslados: Instrucciones de llegada (ej: "Esperar en columna 9", "90 min de espera").
   - punto_encuentro: Para tours compartidos (ej: "Zonas Reforma, Polanco").

3. REQUISITOS Y RESTRICCIONES:
   - minimo_pax: Número mínimo de pasajeros.
   - documentacion_requisitos: Visas, vacunas, pasaportes.
   - seguro_viaje: Detalles del seguro incluido o costo adicional.

4. FINANZAS Y AGENTE:
   - comision: Valor de la comisión fija.
   - bono_counter: Incentivo extra (ej: "+$10 de bono").

5. CONTENIDO DESCRIPTIVO:
   - incluye / no_incluye / cortesias_ctb / itinerario_lista / hoteles_previstos.
   - notas_habitacion: Detalles de camas o tipos de habitación.
   - excursiones_opcionales: Tours con costo extra (ej: "Globo", "Cena").
   - politicas_cancelacion / notas_importantes / feriados / telefono_emergencia.

REGLA DE ORO: Copia literal. No resumas. Si un campo no existe en el documento, déjalo vacío "".

ESQUEMA JSON:
{
  "codigo": "", "nombre": "", "duracion_label": "", "duracion_dias": 0, "duracion_noches": 0,
  "pais_destino": "", "ciudad_destino": "", "aeropuerto_salida": "", "ciudad_salida": "",
  "aerolinea": "", "politica_equipaje": "", "comision": "", "bono_counter": "",
  "salidas_especificas": "", "minimo_pax": "", "punto_encuentro": "", "informacion_traslados": "",
  "documentacion_requisitos": "", "seguro_viaje": "", "telefono_emergencia": "",
  "incluye": "", "no_incluye": "", "cortesias_ctb": "", "itinerario_lista": [],
  "hoteles_previstos": "", "notas_habitacion": "", "politica_ninos": "",
  "excursiones_opcionales": "", "politicas_cancelacion": "", "feriados": "", 
  "notas_importantes": "", "condiciones_especiales": ""
}
`;

export const extractProgramData = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analiza y transcribe este programa minuciosamente. No dejes ningún detalle logístico fuera:\n\n${text}` }
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
