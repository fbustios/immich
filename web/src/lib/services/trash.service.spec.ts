
import { mdiDeleteForeverOutline, mdiHistory } from '@mdi/js';
import { describe, it, expect, vi } from 'vitest';
import { vitest } from 'vitest';
import { getTrashActions} from './trash.service';

vi.mock('@immich/sdk', () => ({
  emptyTrash: vi.fn(),
  restoreTrash: vi.fn(),
}));

vi.mock('@immich/ui', () => ({
  modalManager: {
    showDialog: vi.fn(),
  },
  toastManager: {
    primary: vi.fn(),
  },
}));

vi.mock('@mdi/js', () => ({
  mdiHistory: 'mdi-history',
  mdiDeleteForeverOutline: 'mdi-delete-forever-outline',
}));

vi.mock('$lib/utils/handle-error', () => ({
  handleError: vi.fn(),
}));

vi.mock('$lib/utils/i18n', () => ({
  getFormatter: vi.fn(),
}));

const $t = (key: string) => key;

describe('Trash', () => {
  it('1. RestoreAll has correct title', () => {
    const mockT = vi.fn((key: string) => key);
    const actions = getTrashActions(mockT as never);
    const RestoreAll = actions.RestoreAll;

    expect(RestoreAll.title).toBe('restore_all');
  });

  it('2. RestoreAll is called correctly', () => {
    const mockT = vi.fn((key: string) => key);
    const actions = getTrashActions(mockT as never);
    const RestoreAll = actions.RestoreAll;

    expect(mockT).toHaveBeenCalledWith('restore_all');
  });

  it('3. RestoreAll has the correct icon', () => {
    const actions = getTrashActions($t as never);
    const RestoreAll = actions.RestoreAll;

    expect(RestoreAll.icon).toBe(mdiHistory);
  });

  it('4. Empty has correct title', () => {
    const mockT = vi.fn((key: string) => key);
    const actions = getTrashActions(mockT as never);
    const Empty = actions.Empty;

    expect(Empty.title).toBe('empty_trash');
  });

  it('5. Empty has called correctly', () => {
    const mockT = vi.fn((key: string) => key);
    const actions = getTrashActions(mockT as never);
    const Empty = actions.Empty;

    expect(mockT).toHaveBeenCalledWith('empty_trash');
  });

  it('6. Empty has the correct icon', () => {
    const actions = getTrashActions($t as never);
    const Empty = actions.Empty;

    expect(Empty.icon).toBe(mdiDeleteForeverOutline);
  });

  it('7. Empty.onAction is a callable function', () => {
    const actions = getTrashActions($t as never);
    const Empty = actions.Empty;

    expect(typeof Empty.onAction).toBe('function');
  });

  it('8. RestoreAll.onAction is a callable function', () => {
    const actions = getTrashActions($t as never);
    const RestoreAll = actions.RestoreAll;

    expect(typeof RestoreAll.onAction).toBe('function');
  });

  it('9. RestoreAll icon is not undefined', () => {
    const actions = getTrashActions($t as never);

    expect(actions.RestoreAll.icon).not.toBeUndefined();
  });

  it('10. RestoreAll icon is not null', () => {
    const actions = getTrashActions($t as never);

    expect(actions.RestoreAll.icon).not.toBeNull();
  });

  it('11. Empty icon is not undefined', () => {
    const actions = getTrashActions($t as never);

    expect(actions.Empty.icon).not.toBeUndefined();
  });

  it('12. Empty icon is not null', () => {
    const actions = getTrashActions($t as never);

    expect(actions.Empty.icon).not.toBeNull();
  });
});
