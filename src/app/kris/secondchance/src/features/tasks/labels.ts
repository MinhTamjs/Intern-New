import type { TaskLabel } from './types';

// Re-export TaskLabel for components that need it
export type { TaskLabel };

// Predefined labels organized by category
export const PREDEFINED_LABELS: Record<string, TaskLabel[]> = {
  priority: [
    // High, Medium, Low priority labels removed
  ],
  type: [
    {
      id: 'type-bug',
      name: 'Bug',
      color: '#dc2626',
      category: 'type',
      bgColor: '#fef2f2',
      textColor: '#dc2626'
    },
    {
      id: 'type-feature',
      name: 'Feature',
      color: '#2563eb',
      category: 'type',
      bgColor: '#eff6ff',
      textColor: '#2563eb'
    },
    {
      id: 'type-task',
      name: 'Task',
      color: '#7c3aed',
      category: 'type',
      bgColor: '#faf5ff',
      textColor: '#7c3aed'
    },
    {
      id: 'type-improvement',
      name: 'Improvement',
      color: '#059669',
      category: 'type',
      bgColor: '#f0fdf4',
      textColor: '#059669'
    },
    {
      id: 'type-research',
      name: 'Research',
      color: '#0891b2',
      category: 'type',
      bgColor: '#f0f9ff',
      textColor: '#0891b2'
    }
  ],
  status: [
    {
      id: 'status-blocked',
      name: 'Blocked',
      color: '#dc2626',
      category: 'status',
      bgColor: '#fef2f2',
      textColor: '#dc2626'
    },
    {
      id: 'status-needs-review',
      name: 'Needs Review',
      color: '#d97706',
      category: 'status',
      bgColor: '#fffbeb',
      textColor: '#d97706'
    },
    {
      id: 'status-waiting',
      name: 'Waiting',
      color: '#6b7280',
      category: 'status',
      bgColor: '#f9fafb',
      textColor: '#6b7280'
    },
    {
      id: 'status-refactor',
      name: 'Refactor',
      color: '#7c3aed',
      category: 'status',
      bgColor: '#faf5ff',
      textColor: '#7c3aed'
    }
  ],
  team: [
    {
      id: 'team-frontend',
      name: 'Frontend',
      color: '#2563eb',
      category: 'team',
      bgColor: '#eff6ff',
      textColor: '#2563eb'
    },
    {
      id: 'team-backend',
      name: 'Backend',
      color: '#059669',
      category: 'team',
      bgColor: '#f0fdf4',
      textColor: '#059669'
    },
    {
      id: 'team-qa',
      name: 'QA',
      color: '#d97706',
      category: 'team',
      bgColor: '#fffbeb',
      textColor: '#d97706'
    },
    {
      id: 'team-design',
      name: 'Design',
      color: '#ec4899',
      category: 'team',
      bgColor: '#fdf2f8',
      textColor: '#ec4899'
    },
    {
      id: 'team-devops',
      name: 'DevOps',
      color: '#0891b2',
      category: 'team',
      bgColor: '#f0f9ff',
      textColor: '#0891b2'
    }
  ],
  custom: [
    {
      id: 'custom-urgent',
      name: 'Urgent',
      color: '#dc2626',
      category: 'custom',
      bgColor: '#fef2f2',
      textColor: '#dc2626'
    },
    {
      id: 'custom-client-feedback',
      name: 'Client Feedback',
      color: '#7c3aed',
      category: 'custom',
      bgColor: '#faf5ff',
      textColor: '#7c3aed'
    },
    {
      id: 'custom-sprint-1',
      name: 'Sprint-1',
      color: '#059669',
      category: 'custom',
      bgColor: '#f0fdf4',
      textColor: '#059669'
    },
    {
      id: 'custom-hotfix',
      name: 'Hotfix',
      color: '#dc2626',
      category: 'custom',
      bgColor: '#fef2f2',
      textColor: '#dc2626'
    }
  ]
};

// Dark mode variants
export const getDarkModeLabel = (label: TaskLabel): TaskLabel => ({
  ...label,
  bgColor: `${label.bgColor}20`, // Add transparency for dark mode
  textColor: label.color
});

// Get all labels flattened
export const getAllLabels = (): TaskLabel[] => {
  return Object.values(PREDEFINED_LABELS).flat();
};

// Get labels by category
export const getLabelsByCategory = (category: string): TaskLabel[] => {
  return PREDEFINED_LABELS[category] || [];
};

// Get label by ID
export const getLabelById = (id: string): TaskLabel | undefined => {
  return getAllLabels().find(label => label.id === id);
}; 