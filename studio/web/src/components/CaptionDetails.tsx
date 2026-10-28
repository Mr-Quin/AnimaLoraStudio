import { useTranslation } from 'react-i18next'

import { Textarea } from './FormControl'

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

interface Props {
  format: 'txt' | 'json' | 'none'
  nl: string
  onNlChange: (nl: string) => void
  /** The caption JSON as last saved; unsaved tag edits are not reflected here. */
  caption: Record<string, unknown> | null | undefined
}

export default function CaptionDetails({ format, nl, onNlChange, caption }: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-related min-h-0">
      {format === 'json' ? (
        <label className="flex flex-col gap-1 text-xs text-fg-tertiary">
          {t('captionDetails.nlLabel')}
          <Textarea
            value={nl}
            onChange={(e) => onNlChange(e.target.value)}
            placeholder={t('captionDetails.nlPlaceholder')}
            controlSize="sm"
            rows={5}
            className="w-full resize-y text-fg-primary"
          />
        </label>
      ) : (
        <p className="m-0 text-xs text-fg-tertiary">{t('captionDetails.txtHint')}</p>
      )}
      {caption && (
        <details className="text-xs">
          <summary className="cursor-pointer text-fg-tertiary select-none">
            {t('captionDetails.jsonTitle')}
          </summary>
          <div className="mt-1.5 overflow-x-auto">
            <JsonValue value={caption as Json} />
          </div>
        </details>
      )}
    </div>
  )
}

function isPrimitive(v: Json): v is string | number | boolean | null {
  return v === null || typeof v !== 'object'
}

function JsonValue({ value }: { value: Json }) {
  if (value === null || value === '') {
    return <span className="text-fg-tertiary">—</span>
  }
  if (typeof value === 'string') {
    return <span className="text-fg-primary whitespace-pre-wrap break-words">{value}</span>
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="font-mono text-fg-secondary">{String(value)}</span>
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-fg-tertiary">[ ]</span>
    if (value.every(isPrimitive)) {
      return (
        <span className="flex flex-wrap gap-1">
          {value.map((item, i) => (
            <span
              key={i}
              className="px-1.5 py-px rounded-sm bg-overlay border border-subtle font-mono text-[11px] text-fg-primary"
            >
              {String(item)}
            </span>
          ))}
        </span>
      )
    }
    return (
      <ol className="m-0 pl-4 flex flex-col gap-1">
        {value.map((item, i) => <li key={i}><JsonValue value={item} /></li>)}
      </ol>
    )
  }
  const entries = Object.entries(value)
  if (entries.length === 0) return <span className="text-fg-tertiary">{'{ }'}</span>
  return (
    <dl className="m-0 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-2 gap-y-1">
      {entries.map(([key, item]) => (
        <div key={key} className="contents">
          <dt className="font-mono text-fg-tertiary">{key}</dt>
          <dd className="m-0 min-w-0">
            {isPrimitive(item) ? (
              <JsonValue value={item} />
            ) : (
              <div className="pl-2 border-l border-subtle"><JsonValue value={item} /></div>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
