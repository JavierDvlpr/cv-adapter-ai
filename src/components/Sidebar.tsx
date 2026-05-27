import { aiProviders } from '../config/aiProviders';
import { cvFonts } from '../config/fonts';
import { cvFormats } from '../config/formats';
import { OptionButtons } from './OptionButtons';
import type { AiProviderId, CvFontId, CvFormatId, Language, LinkKey, LinkState, SectionCaseId } from '../types/cv';

interface SidebarProps {
  providerId: AiProviderId;
  apiKey: string;
  model: string;
  fontId: CvFontId;
  formatId: CvFormatId;
  outputLanguage: Language;
  sectionCase: SectionCaseId;
  autoFileName: boolean;
  jobDesc: string;
  links: LinkState;
  fileName: string;
  isLoading: boolean;
  canExport: boolean;
  onProviderChange: (value: AiProviderId) => void;
  onApiKeyChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onFontChange: (value: CvFontId) => void;
  onFormatChange: (value: CvFormatId) => void;
  onOutputLanguageChange: (value: Language) => void;
  onSectionCaseChange: (value: SectionCaseId) => void;
  onAutoFileNameChange: (value: boolean) => void;
  onJobDescChange: (value: string) => void;
  onClearJobDesc: () => void;
  onToggleLink: (key: LinkKey) => void;
  onFileNameChange: (value: string) => void;
  onAdapt: () => void;
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
}

export function Sidebar({
  providerId,
  apiKey,
  model,
  fontId,
  formatId,
  outputLanguage,
  sectionCase,
  autoFileName,
  jobDesc,
  links,
  fileName,
  isLoading,
  canExport,
  onProviderChange,
  onApiKeyChange,
  onModelChange,
  onFontChange,
  onFormatChange,
  onOutputLanguageChange,
  onSectionCaseChange,
  onAutoFileNameChange,
  onJobDescChange,
  onClearJobDesc,
  onToggleLink,
  onFileNameChange,
  onAdapt,
  onDownloadDocx,
  onDownloadPdf
}: SidebarProps) {
  const isSpanish = false;
  const ui = {
    subtitle: isSpanish ? 'Editor de CV · flujo modular y apto para ATS' : 'CV editor · modular flow and ATS-friendly',
    provider: isSpanish ? 'Proveedor de IA' : 'AI provider',
    apiKey: 'API key',
    apiKeyHint: isSpanish ? 'La clave se guarda en el navegador, no en una base de datos.' : 'The key is saved in the browser, not in a database.',
    apiKeyMemory: isSpanish ? 'Se recuerda por proveedor y queda solo en este navegador.' : 'It is remembered per provider and stays only in this browser.',
    model: isSpanish ? 'Modelo' : 'Model',
    outputLanguage: isSpanish ? 'Idioma de salida' : 'Output language',
    font: isSpanish ? 'Tipografía' : 'Typeface',
    template: isSpanish ? 'Plantilla' : 'Template',
    titleCase: isSpanish ? 'Estilo de títulos' : 'Title case style',
    job: isSpanish ? 'Vacante' : 'Job description',
    clear: isSpanish ? 'Limpiar' : 'Clear',
    fileName: isSpanish ? 'Nombre de archivo' : 'File name',
    autoName: isSpanish ? 'Auto nombre con IA' : 'Auto name with AI',
    autoNameHint: isSpanish ? 'Si activas el auto nombre, la IA sugiere el archivo en cada generación.' : 'If auto naming is on, AI suggests the file on each generation.',
    adapt: isSpanish ? 'Adaptar CV' : 'Adapt CV',
    downloadDocx: isSpanish ? 'Descargar DOCX' : 'Download DOCX',
    downloadPdf: isSpanish ? 'Descargar PDF' : 'Download PDF',
    links: 'Links',
    capitalized: isSpanish ? 'Capitalizado' : 'Capitalized',
    uppercase: isSpanish ? 'Mayúsculas' : 'Uppercase',
    jobPlaceholder: isSpanish ? 'Pega aquí la descripción completa del cargo...' : 'Paste the full job description here...',
    linkLabels: isSpanish
      ? { linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portafolio', email: 'Correo', phone: 'Teléfono' }
      : { linkedin: 'LinkedIn', github: 'GitHub', portfolio: 'Portfolio', email: 'Email', phone: 'Phone' }
  };

  const outputLanguageOptions = [{ value: 'en' as const, label: 'English', preview: 'en' }];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div>
          <div className="logo">
            Adapter <span className="logo-badge">cv</span>
          </div>
          <div className="logo-sub">{ui.subtitle}</div>
        </div>
      </div>

      <div className="sb-section">
        <div className="sb-label">{ui.provider}</div>
        <select value={providerId} onChange={(event) => onProviderChange(event.target.value as AiProviderId)}>
          {aiProviders.map((provider) => (
            <option key={provider.id} value={provider.id}>{provider.label}</option>
          ))}
        </select>
        <div className="helper-text">{ui.apiKeyHint}</div>
      </div>

      <div className="sb-section">
        <div className="sb-label">{ui.apiKey}</div>
        <input type="password" value={apiKey} onChange={(event) => onApiKeyChange(event.target.value)} placeholder="sk-proj-..." />
        <div className="helper-text">{ui.apiKeyMemory}</div>
      </div>

      <div className="sb-section">
        <div className="sb-label">{ui.model}</div>
        <input type="text" value={model} onChange={(event) => onModelChange(event.target.value)} placeholder="gpt-4o / claude-3-5-sonnet-latest / grok-2-latest" />
      </div>

      <OptionButtons label={ui.outputLanguage} value={outputLanguage} onChange={onOutputLanguageChange} columns={2} options={outputLanguageOptions} />

      <OptionButtons
        label={ui.font}
        value={fontId}
        onChange={onFontChange}
        columns={3}
        options={cvFonts.map((font) => ({ value: font.id, label: font.label, preview: 'Aa', fontFamily: font.family }))}
      />

      <OptionButtons
        label={ui.template}
        value={formatId}
        onChange={onFormatChange}
        columns={1}
        options={cvFormats.map((format) => ({ value: format.id, label: format.label, preview: format.description }))}
      />

      <OptionButtons
        label={ui.titleCase}
        value={sectionCase}
        onChange={onSectionCaseChange}
        columns={2}
        options={[
          { value: 'capitalize', label: ui.capitalized, preview: isSpanish ? 'Perfil profesional' : 'Professional profile' },
          { value: 'uppercase', label: ui.uppercase, preview: isSpanish ? 'PERFIL PROFESIONAL' : 'PROFESSIONAL PROFILE' }
        ]}
      />

      <div className="sb-section">
        <div className="sb-label">{ui.job}</div>
        <div className="section-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClearJobDesc}>{ui.clear}</button>
        </div>
        <textarea rows={8} value={jobDesc} onChange={(event) => onJobDescChange(event.target.value)} placeholder={ui.jobPlaceholder} />
      </div>

      <div className="sb-section">
        <div className="sb-label">{ui.links}</div>
        {[
          { key: 'linkedin' as const, label: ui.linkLabels.linkedin },
          { key: 'github' as const, label: ui.linkLabels.github },
          { key: 'portfolio' as const, label: ui.linkLabels.portfolio },
          { key: 'email' as const, label: ui.linkLabels.email },
          { key: 'phone' as const, label: ui.linkLabels.phone }
        ].map((item) => (
          <div className="toggle-row" key={item.key}>
            <span>{item.label}</span>
            <button type="button" className={`tog ${links[item.key] ? 'on' : ''}`} aria-pressed={links[item.key]} onClick={() => onToggleLink(item.key)} />
          </div>
        ))}
      </div>

      <div className="sb-section">
        <div className="sb-label">{ui.fileName}</div>
        <div className="toggle-row">
          <span>{ui.autoName}</span>
          <button type="button" className={`tog ${autoFileName ? 'on' : ''}`} aria-pressed={autoFileName} onClick={() => onAutoFileNameChange(!autoFileName)} />
        </div>
        <input type="text" value={fileName} onChange={(event) => onFileNameChange(event.target.value)} disabled={autoFileName} />
        <div className="helper-text">{ui.autoNameHint}</div>
      </div>

      <div className="sb-section sidebar-actions">
        <button type="button" className="btn btn-primary" onClick={onAdapt} disabled={isLoading}>{ui.adapt}</button>
        <div className="dl-row">
          <button type="button" className="btn btn-dl" onClick={onDownloadDocx} disabled={!canExport}>{ui.downloadDocx}</button>
          <button type="button" className="btn btn-pdf" onClick={onDownloadPdf} disabled={!canExport}>{ui.downloadPdf}</button>
        </div>
      </div>
    </aside>
  );
}
