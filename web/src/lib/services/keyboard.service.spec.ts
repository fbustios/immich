import { modalManager } from '@immich/ui';
import { mdiKeyboard } from '@mdi/js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vitest } from 'vitest';
import ShortcutsModal from '$lib/modals/ShortcutsModal.svelte';
import { getKeyboardActions } from './keyboard.service';

vi.mock('@immich/ui', () => ({
  modalManager: {
    show: vi.fn(),
  },
}));

vi.mock('@mdi/js', () => ({
  mdiKeyboard: 'mdi-keyboard',
}));

vi.mock('$lib/modals/ShortcutsModal.svelte', () => ({ default: {} }));

const $t = (key: string) => key;

describe('Keyboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. KeyboardShortcuts has correct title', () => {
    const mockT = vi.fn((key: string) => key);
    const actions = getKeyboardActions(mockT as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(mockT).toHaveBeenCalledWith('show_keyboard_shortcuts');
    expect(KeyboardShortcuts.title).toBe('show_keyboard_shortcuts');
  });

  it('2. KeyboardShortcuts has the correct icon', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(KeyboardShortcuts.icon).toBe(mdiKeyboard);
  });

  it('3. KeyboardShortcuts.onAction is a callable function', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(typeof KeyboardShortcuts.onAction).toBe('function');
  });

  it('4. KeyboardShortcuts.onAction opens ShortcutsModal', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    KeyboardShortcuts.onAction();

    expect(modalManager.show).toHaveBeenCalledWith(ShortcutsModal, {});
  });

  it('5. KeyboardShortcuts.onAction opens modal with empty props', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    KeyboardShortcuts.onAction();

    expect(modalManager.show).toHaveBeenCalledWith(expect.anything(), {});
  });

  it('6. Calling onAction multiple times opens the modal each time', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    KeyboardShortcuts.onAction();
    KeyboardShortcuts.onAction();

    expect(modalManager.show).toHaveBeenCalledTimes(2);
  });

  it('7. Modal is not opened before onAction is called', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(modalManager.show).not.toHaveBeenCalled();
  });

  it('8. Modal does not open with anything extra beside empty object (not {baseTag})', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    KeyboardShortcuts.onAction();

    expect(modalManager.show).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ baseTag: expect.anything() }),
    );
  });

  it('9. Modal does not open with anything extra beside empty object (not {tag})', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    KeyboardShortcuts.onAction();

    expect(modalManager.show).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ tag: expect.anything() }),
    );
  });

  it('10. A different modal component is never opened', () => {
    const OtherModal = { name: 'SomeOtherModal' };
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    KeyboardShortcuts.onAction();

    expect(modalManager.show).not.toHaveBeenCalledWith(OtherModal, expect.anything());
  });

  it('11. Title is not a raw, untranslated key', () => {
    const mockT = vi.fn().mockReturnValue('Keyboard Shortcuts');
    const actions = getKeyboardActions(mockT as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(KeyboardShortcuts.title).not.toBe('show_keyboard_shortcuts');
  });

  it('12. Icon is not null', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(KeyboardShortcuts.icon).not.toBeNull();
  });

  it('13. Icon is not undefined', () => {
    const actions = getKeyboardActions($t as never);
    const KeyboardShortcuts = actions.KeyboardShortcuts;

    expect(KeyboardShortcuts.icon).not.toBeUndefined();
  });

  it('14. getKeyboardActions does not return unexpected action keys', () => {
    const actions = getKeyboardActions($t as never);

    expect(Object.keys(actions)).toEqual(['KeyboardShortcuts']);
  });
});
