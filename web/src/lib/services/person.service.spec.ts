import { modalManager } from '@immich/ui';
import {
  mdiCalendarEditOutline,
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiHeartMinusOutline,
  mdiHeartOutline,
} from '@mdi/js';
import { vitest, expect, beforeEach } from 'vitest';
import { getPersonActions } from '$lib/services/person.service';
import PersonEditBirthDateModal from '$lib/modals/PersonEditBirthDateModal.svelte';

vitest.mock('@immich/ui', () => ({
  modalManager: {
    show: vitest.fn(),
  },
  toastManager: {
    primary: vitest.fn(),
    danger: vitest.fn(),
  },
}));

vitest.mock('@immich/sdk');

vitest.mock('$lib/managers/event-manager.svelte', () => ({
  eventManager: {
    emit: vitest.fn(),
  },
}));

vitest.mock('$lib/utils/i18n', () => ({
  getFormatter: vitest.fn().mockResolvedValue((key: string) => key),
}));

vitest.mock('$lib/utils/handle-error', () => ({
  handleError: vitest.fn(),
}));

const createMockPerson = (overrides: Record<string, unknown> = {}) => ({
  id: 'person-1',
  name: 'Test Person',
  birthDate: null,
  thumbnailPath: '',
  isHidden: false,
  isFavorite: false,
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const $t = (key: string) => key;

describe('person service', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  describe('getPersonActions - SetDateOfBirth', () => {
    it('has the correct icon', () => {
      const person = createMockPerson();
      const actions = getPersonActions($t as any, person as any);
      expect(actions.SetDateOfBirth.icon).toBe(mdiCalendarEditOutline);
    });

    it('has the correct title', () => {
      const person = createMockPerson();
      const actions = getPersonActions($t as any, person as any);
      expect(actions.SetDateOfBirth.title).toBe('set_date_of_birth');
    });

    it('calls modalManager.show with PersonEditBirthDateModal on action', () => {
      const person = createMockPerson();
      const actions = getPersonActions($t as any, person as any);
      actions.SetDateOfBirth.onAction(actions.SetDateOfBirth);
      expect(modalManager.show).toHaveBeenCalledWith(PersonEditBirthDateModal, { person });
    });
  });

  describe('getPersonActions - Favorite / Unfavorite', () => {
    it('Favorite has the correct icon', () => {
      const person = createMockPerson({ isFavorite: false });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.Favorite.icon).toBe(mdiHeartOutline);
    });

    it('Favorite is shown when person is not favorite', () => {
      const person = createMockPerson({ isFavorite: false });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.Favorite.$if?.()).toBe(true);
    });

    it('Favorite is hidden when person is already favorite', () => {
      const person = createMockPerson({ isFavorite: true });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.Favorite.$if?.()).toBe(false);
    });
  });

  describe('getPersonActions - HidePerson / ShowPerson', () => {
    it('HidePerson is shown when person is visible', () => {
      const person = createMockPerson({ isHidden: false });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.HidePerson.$if?.()).toBe(true);
    });

    it('HidePerson is hidden when person is already hidden', () => {
      const person = createMockPerson({ isHidden: true });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.HidePerson.$if?.()).toBe(false);
    });

    it('ShowPerson is shown when person is hidden', () => {
      const person = createMockPerson({ isHidden: true });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.ShowPerson.$if?.()).toBe(true);
    });

    it('ShowPerson is hidden when person is visible', () => {
      const person = createMockPerson({ isHidden: false });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.ShowPerson.$if?.()).toBe(false);
    });
  });

  describe('getPersonActions - action titles', () => {
    it('Favorite has the correct title', () => {
      const person = createMockPerson();
      const actions = getPersonActions($t as any, person as any);
      expect(actions.Favorite.title).toBe('to_favorite');
    });

    it('HidePerson has the correct title', () => {
      const person = createMockPerson();
      const actions = getPersonActions($t as any, person as any);
      expect(actions.HidePerson.title).toBe('hide_person');
    });

    it('ShowPerson has the correct title', () => {
      const person = createMockPerson({ isHidden: true });
      const actions = getPersonActions($t as any, person as any);
      expect(actions.ShowPerson.title).toBe('unhide_person');
    });
  });
});