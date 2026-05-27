# CV Adapter

CV Adapter es una app en React para adaptar un CV a una vacante, mantener el resultado editable y exportarlo a DOCX o PDF.

## Demo

![CV Adapter en acción](./cv-adapter-ai.gif)

## Qué hace

- Adapta el CV usando 7 proveedores de IA: OpenAI, Anthropic, xAI, Google Gemini, Mistral, DeepSeek y Groq.
- Mantiene el resultado editable en el preview.
- Exporta DOCX y PDF con la misma estructura visual del preview.
- Guarda la configuración en el navegador con `localStorage`.
- Genera un nombre de archivo con el nombre del postulante, el título de la vacante y el sufijo `CV`.

## Cómo funciona

1. Pega la descripción de la vacante.
2. Elige proveedor de IA, modelo, idioma de salida, tipografía y plantilla.
3. Pulsa Adapt CV.
4. Revisa el preview editable.
5. Descarga DOCX o PDF.

## Datos locales

Todos los datos del postulante están en `src/data/data.ts`. Este archivo está ignorado por Git, así que puedes editarlo sin miedo de afectar el control de versiones.

### Cómo empezar con tus datos

1. Abre `src/data/data.ts` - aquí va toda tu información personal.
2. O usa `src/data/data.example.ts` como referencia para entender el formato esperado.

### Opción A: Edición manual

Edita `src/data/data.ts` directamente con tu información:
- Perfil: nombre, correo, teléfono, ubicación, redes sociales
- Experiencia: roles anteriores, empresas, responsabilidades, tecnologías
- Proyectos: proyectos de portafolio con descripciones
- Habilidades: habilidades técnicas y profesionales por categoría
- Educación: grados y certificaciones
- Certificaciones: certificaciones profesionales

### Opción B: Usa una IA para llenar la estructura

Si tienes tu CV en texto, puedes pedirle a una IA que lo convierte:

1. Copia el texto de tu CV (de un documento, LinkedIn, etc.)
2. Pídele a ChatGPT, Claude, o cualquier IA:

   > Convierte mi CV en esta estructura TypeScript: `{ profile: {...}, experience: [...], projects: [...], skills: [...], education: [...], certifications: [...] }`
   > 
   > Aquí está mi CV: [pega tu texto de CV]

3. Copia la estructura generada en `src/data/data.ts`

## Proveedores de IA soportados

- **OpenAI**: GPT-4, GPT-4o y otros modelos
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus y otros modelos Claude
- **xAI**: Grok 2 y otros modelos Grok
- **Google Gemini**: Gemini 2.0 Flash y otros modelos Gemini
- **Mistral**: Mistral Small, Mistral Large y otros modelos Mistral
- **DeepSeek**: DeepSeek Chat y otros modelos DeepSeek
- **Groq**: Llama 3.1 70B y otros modelos Groq

## Uso de API

- Las claves de API no se guardan en el código fuente.
- Se almacenan solo en el navegador, por proveedor.
- Cada proveedor de IA usa sus propias credenciales y modelo.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Estructura

- `src/App.tsx`: orquestación principal.
- `src/data/`: datos base y opción local ignorada.
- `src/components/`: interfaz reutilizable.
- `src/services/`: adaptación y exportación.
- `src/utils/`: utilidades compartidas.

## Notas

- Si la vacante pide más experiencia mínima de la que tienes, la app muestra un aviso pero deja que la IA decida el ajuste semántico final.
- El nombre automático combina postulante + vacante + `CV`.