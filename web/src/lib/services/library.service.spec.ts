import { modalManager } from '@immich/ui';
import {
  mdiInformationOutline,
  mdiPencilOutline,
  mdiPlusBoxOutline,
  mdiSync,
  mdiTrashCanOutline,
} from '@mdi/js';
import { vitest, expect, beforeEach } from 'vitest';
import {
  getLibrariesActions,
  getLibraryActions,
  getLibraryFolderActions,
  getLibraryExclusionPatternActions,
} from '$lib/services/library.service';
import LibraryFolderEditModal from '$lib/modals/LibraryFolderEditModal.svelte';
import LibraryFolderAddModal from '$lib/modals/LibraryFolderAddModal.svelte';
import LibraryExclusionPatternEditModal from '$lib/modals/LibraryExclusionPatternEditModal.svelte';
import LibraryExclusionPatternAddModal from '$lib/modals/LibraryExclusionPatternAddModal.svelte';

vitest.mock('@immich/ui', () => ({
  modalManager: {
    show: vitest.fn(),
    showDialog: vitest.fn(),
  },
  toastManager: {
    primary: vitest.fn(),
    info: vitest.fn(),
    danger: vitest.fn(),
  },
}));

vitest.mock('@immich/sdk');

vitest.mock('$app/navigation', () => ({
  goto: vitest.fn(),
}));

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

const $t = (key: string) => key;

const createMockLibrary = (overrides: Record<string, unknown> = {}) => ({
  id: 'library-1',
  name: 'Test Library',
  ownerId: 'owner-1',
  importPaths: ['/photos'],
  exclusionPatterns: ['*.tmp'],
  assetCount: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  refreshedAt: null,
  ...overrides,
});

describe('library service', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  describe('getLibrariesActions', () => {
    it('ScanAll has the correct icon', () => {
      const actions = getLibrariesActions($t as any);
      expect(actions.ScanAll.icon).toBe(mdiSync);
    });

    it('ScanAll has the correct title', () => {
      const actions = getLibrariesActions($t as any);
      expect(actions.ScanAll.title).toBe('scan_all_libraries');
    });

    it('Create has the correct icon', () => {
      const actions = getLibrariesActions($t as any);
      expect(actions.Create.icon).toBe(mdiPlusBoxOutline);
    });

    it('Create has the correct title', () => {
      const actions = getLibrariesActions($t as any);
      expect(actions.Create.title).toBe('create_library');
    });
  });

  describe('getLibraryActions', () => {
    it('Detail has the correct icon', () => {
      const library = createMockLibrary();
      const actions = getLibraryActions($t as any, library as any);
      expect(actions.Detail.icon).toBe(mdiInformationOutline);
    });

    it('Edit has the correct icon and title', () => {
      const library = createMockLibrary();
      const actions = getLibraryActions($t as any, library as any);
      expect(actions.Edit.icon).toBe(mdiPencilOutline);
      expect(actions.Edit.title).toBe('edit');
    });

    it('Delete has the correct icon and danger color', () => {
      const library = createMockLibrary();
      const actions = getLibraryActions($t as any, library as any);
      expect(actions.Delete.icon).toBe(mdiTrashCanOutline);
      expect(actions.Delete.color).toBe('danger');
    });

    it('AddFolder has the correct icon and calls modalManager on action', () => {
      const library = createMockLibrary();
      const actions = getLibraryActions($t as any, library as any);
      expect(actions.AddFolder.icon).toBe(mdiPlusBoxOutline);
      actions.AddFolder.onAction(actions.AddFolder);
      expect(modalManager.show).toHaveBeenCalledWith(LibraryFolderAddModal, { library });
    });

    it('AddExclusionPattern calls modalManager on action', () => {
      const library = createMockLibrary();
      const actions = getLibraryActions($t as any, library as any);
      actions.AddExclusionPattern.onAction(actions.AddExclusionPattern);
      expect(modalManager.show).toHaveBeenCalledWith(LibraryExclusionPatternAddModal, { library });
    });

    it('Scan has the correct icon and title', () => {
      const library = createMockLibrary();
      const actions = getLibraryActions($t as any, library as any);
      expect(actions.Scan.icon).toBe(mdiSync);
      expect(actions.Scan.title).toBe('scan_library');
    });
  });

  describe('getLibraryFolderActions', () => {
    it('Edit calls modalManager with LibraryFolderEditModal', () => {
      const library = createMockLibrary();
      const folder = '/photos/vacation';
      const actions = getLibraryFolderActions($t as any, library as any, folder);
      actions.Edit.onAction(actions.Edit);
      expect(modalManager.show).toHaveBeenCalledWith(LibraryFolderEditModal, { folder, library });
    });
  });

  describe('getLibraryExclusionPatternActions', () => {
    it('Edit calls modalManager with LibraryExclusionPatternEditModal', () => {
      const library = createMockLibrary();
      const pattern = '*.tmp';
      const actions = getLibraryExclusionPatternActions($t as any, library as any, pattern);
      actions.Edit.onAction(actions.Edit);
      expect(modalManager.show).toHaveBeenCalledWith(LibraryExclusionPatternEditModal, {
        exclusionPattern: pattern,
        library,
      });
    });
  });
});