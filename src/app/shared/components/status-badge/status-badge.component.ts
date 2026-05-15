import { Component, input, computed } from '@angular/core';
import { NgClass } from '@angular/common';

interface BadgeConfig {
  container: string;
  dot: string;
  label: string;
}

const BADGE_MAP: Record<string, BadgeConfig> = {
  TRUE: {
    container: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    label: 'Activo',
  },
  FALSE: {
    container: 'bg-slate-100 text-slate-500 ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20',
    dot: 'bg-slate-400 dark:bg-slate-500',
    label: 'Inactivo',
  },
  ACTIVO: {
    container: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    label: 'Activo',
  },
  INACTIVO: {
    container: 'bg-slate-100 text-slate-500 ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20',
    dot: 'bg-slate-400 dark:bg-slate-500',
    label: 'Inactivo',
  },
  PENDIENTE: {
    container: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
    dot: 'bg-amber-500 dark:bg-amber-400',
    label: 'Pendiente',
  },
  SUSPENDIDO: {
    container: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
    dot: 'bg-red-500 dark:bg-red-400',
    label: 'Suspendido',
  },
};

const FALLBACK: BadgeConfig = {
  container: 'bg-slate-100 text-slate-500 ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20',
  dot: 'bg-slate-400',
  label: '',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  styles: [':host { display: contents; }'],
  template: `
    <span class="inline-flex items-center gap-1.5 text-[0.71rem] font-semibold px-2.5 py-0.5 rounded-full ring-1 ring-inset"
          [ngClass]="config().container">
      <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" [ngClass]="config().dot"></span>
      {{ config().label || value() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  value = input.required<string | boolean>();
  config = computed(() => {
    const key = String(this.value()).toUpperCase();
    return BADGE_MAP[key] ?? { ...FALLBACK, label: String(this.value()) };
  });
}
