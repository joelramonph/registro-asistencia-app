import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationModule } from "../types";

// Per Vite guidelines, environment variables are accessed via import.meta.env
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("La clave de API de Gemini no se ha encontrado. Las funciones de IA estarán deshabilitadas. Asegúrate de configurar VITE_API_KEY en tu entorno.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const evaluationModuleSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "Un nombre corto y descriptivo para el módulo de evaluación (p. ej., 'Tarea', 'Participación en clase')."
    },
    type: {
      type: Type.STRING,
      enum: ['text', 'select'],
      description: "El tipo de entrada. Usa 'select' para opciones predefinidas y 'text' para notas de formato libre."
    },
    options: {
      type: Type.ARRAY,
      description: "Un array de cadenas de texto para las opciones si el tipo es 'select'. Esta propiedad debe omitirse si el tipo es 'text'.",
      items: { type: Type.STRING }
    }
  },
  required: ['name', 'type'],
};

export const generateEvaluationModule = async (prompt: string): Promise<Omit<EvaluationModule, 'id'> | null> => {
  if (!ai) {
    throw new Error("La API de Gemini no está inicializada. Por favor, proporciona una clave de API.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Basado en la siguiente solicitud de un profesor, crea un módulo de evaluación adecuado: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationModuleSchema,
      },
    });

    const jsonString = response.text?.trim();
    if (!jsonString) {
        console.error("La API de Gemini devolvió una respuesta vacía.");
        return null;
    }

    const parsedModule = JSON.parse(jsonString) as Omit<EvaluationModule, 'id'>;
    
    // Basic validation
    if (!parsedModule.name || !parsedModule.type) {
      console.error("Al módulo generado le faltan los campos obligatorios 'name' o 'type'.", parsedModule);
      return null;
    }
    
    if (parsedModule.type === 'select' && (!parsedModule.options || !Array.isArray(parsedModule.options))) {
       console.warn("Al módulo 'select' generado le falta el array 'options'. Se usará un array vacío por defecto.", parsedModule);
       parsedModule.options = [];
    }

    if(parsedModule.type === 'text') {
        delete parsedModule.options;
    }

    return parsedModule;
  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    return null;
  }
};