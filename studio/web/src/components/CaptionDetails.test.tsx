import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import CaptionDetails from './CaptionDetails'

describe('CaptionDetails', () => {
  it('renders nested caption JSON with one chip per list item', () => {
    render(
      <CaptionDetails
        format="json"
        nl="A quiet scene."
        onNlChange={vi.fn()}
        caption={{
          meta: { trigger: 'sks', post_id: 12 },
          tags: { count: '1girl, solo', tags: ['collar', 'leash'], environment: [], nl: 'A quiet scene.' },
        }}
      />,
    )

    expect(screen.getByText('collar')).toBeInTheDocument()
    expect(screen.getByText('leash')).toBeInTheDocument()
    expect(screen.getByText('1girl, solo')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('[ ]')).toBeInTheDocument()
  })
})
