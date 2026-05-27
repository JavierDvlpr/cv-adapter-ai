# CV Adapter

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.14-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![DOCX](https://img.shields.io/badge/DOCX-Export-2E7D32)](https://www.npmjs.com/package/docx)
[![PDF](https://img.shields.io/badge/PDF-Export-1565C0)](https://www.npmjs.com/package/file-saver)

CV Adapter is a React app that adapts a CV to a job description, keeps the result editable, and exports it to DOCX or PDF.

## What it does

- Adapts the CV using 7 AI providers: OpenAI, Anthropic, xAI, Google Gemini, Mistral, DeepSeek, and Groq.
- Keeps the output editable in the preview.
- Exports DOCX and PDF with the same visual structure as the preview.
- Stores app settings in the browser with `localStorage`.
- Generates a file name from the applicant name, job title, and the `CV` suffix.

## How it works

1. Paste the job description.
2. Choose AI provider, model, output language, font, and template.
3. Click Adapt CV.
4. Review the editable preview.
5. Download DOCX or PDF.

## Local data

All applicant data is stored in `src/data/data.ts`. This file is ignored by Git, so you can edit it safely without affecting version control.

### Getting started with your data

1. Open `src/data/data.ts` - this is where all your personal information goes.
2. Or use `src/data/data.example.ts` as a reference to understand the expected format.

### Option A: Manual edit

Edit `src/data/data.ts` directly with your information:
- Profile: name, email, phone, location, social links
- Experience: past roles, companies, responsibilities, technologies
- Projects: portfolio projects with descriptions
- Skills: technical and professional skills by category
- Education: degrees and certifications
- Certifications: professional certifications

### Option B: Use AI to populate the structure

If you have your CV in text format, you can ask an AI assistant to convert it:

1. Copy your CV text (from a document, LinkedIn, etc.)
2. Ask ChatGPT, Claude, or another AI:

   > Convert my CV into this TypeScript structure: `{ profile: {...}, experience: [...], projects: [...], skills: [...], education: [...], certifications: [...] }`
   > 
   > Here is my CV: [paste your CV text]

3. Copy the generated structure into `src/data/data.ts`

## Supported AI Providers

- **OpenAI**: GPT-4, GPT-4o, and other models
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, and other Claude models
- **xAI**: Grok 2 and other Grok models
- **Google Gemini**: Gemini 2.0 Flash and other Gemini models
- **Mistral**: Mistral Small, Mistral Large, and other Mistral models
- **DeepSeek**: DeepSeek Chat and other DeepSeek models
- **Groq**: Llama 3.1 70B and other Groq models

## API usage

- API keys are not stored in the source code.
- They are stored only in the browser, per provider.
- Each AI provider uses its own credentials and model.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/App.tsx`: main orchestration.
- `src/data/`: base data and optional local override.
- `src/components/`: reusable UI.
- `src/services/`: adaptation and export logic.
- `src/utils/`: shared utilities.

## Notes

- If the job requires more minimum experience than the applicant has, the app shows a warning but still lets the AI decide the final semantic match.
- The auto file name combines applicant name + job title + `CV`.