/**
 * Open-ended Free Build validation. Reuses the ValidationResult shape (so the
 * same ValidationPanel renders it) but judges against a category's soft guidance
 * rather than one fixed solution. Explains what works, what's missing, what's
 * unnecessary and what could be improved.
 */

import { LabArchitecture } from '../types';
import { Diagnostic, ValidationResult } from '../validation/validate';
import { getComponent } from '../data/components';
import { FreeCategory } from './categories';

const label = (id: any) => getComponent(id).label;

export const freeBuildFeedback = (
  category: FreeCategory,
  arch: LabArchitecture,
): ValidationResult => {
  const placed = arch.components;

  if (placed.length === 0) {
    return {
      status: 'empty',
      ok: false,
      issues: [{ level: 'info', title: 'Add components to start building your AI.' }],
    };
  }

  const issues: Diagnostic[] = [];

  // What's missing — category core.
  const missingCore = category.core.filter(id => !placed.includes(id));
  missingCore.forEach(id =>
    issues.push({
      level: 'error',
      title: `Missing ${label(id)}.`,
      suggestion: `${category.label} AIs need it — ${getComponent(id).blurb}`,
      componentId: id,
    }),
  );

  // What's unnecessary — components outside the category's typical set.
  if (category.id !== 'custom') {
    placed
      .filter(id => !category.typical.includes(id))
      .forEach(id =>
        issues.push({
          level: 'warn',
          title: `${label(id)} is unusual for a ${category.label} AI.`,
          suggestion: `Probably not needed here — consider removing ${label(id)}.`,
          componentId: id,
        }),
      );
  }

  // A brain is the heart of nearly every AI — nudge if it's absent.
  if (!placed.includes('brain') && !category.core.includes('brain')) {
    issues.push({
      level: 'info',
      title: 'Most AI systems need an AI Brain to make decisions.',
      suggestion: 'Consider adding an AI Brain.',
      componentId: 'brain',
    });
  }

  // What could be improved — recommended upgrades not yet added.
  category.recommended
    .filter(id => !placed.includes(id))
    .forEach(id =>
      issues.push({
        level: 'info',
        title: `Could improve: add ${label(id)}.`,
        suggestion: getComponent(id).blurb,
      }),
    );

  const ok = missingCore.length === 0;

  if (ok) {
    const flow = placed.map(id => label(id)).join(' → ');
    issues.unshift({
      level: 'success',
      title: `Your ${category.label} AI works!`,
      suggestion: `It runs input through: ${flow}.`,
    });
  }

  return { status: ok ? 'complete' : 'incomplete', ok, issues };
};
