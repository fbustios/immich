import {
  mdiCodeJson,
  mdiContentCopy,
  mdiContentDuplicate,
  mdiDeleteOutline,
  mdiDownload,
  mdiFileDocumentMultipleOutline,
  mdiPause,
  mdiPencil,
  mdiPlay,
  mdiPlus,
} from '@mdi/js';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  getWorkflowsActions,
  getWorkflowActions,
  getWorkflowShowSchemaAction,
} from './workflow.service';

vi.mock('@immich/ui', () => ({
  modalManager: {
    show: vi.fn(),
    showDialog: vi.fn(),
  },
  toastManager: {
    success: vi.fn(),
    primary: vi.fn(),
  },
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

vi.mock('$lib/utils', () => ({
  copyToClipboard: vi.fn(),
  downloadJson: vi.fn(),
}));

vi.mock('$lib/utils/handle-error', () => ({
  handleError: vi.fn(),
}));

vi.mock('$lib/utils/i18n', () => ({
  getFormatter: vi.fn(),
}));

const $t = (key: string) => key;

const workflow = {
  id: 'workflow-id',
  name: 'Workflow',
  description: 'Description',
  enabled: false,
  trigger: 'AssetCreate',
  steps: [],
} as any;

describe('workflow service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getWorkflowsActions', () => {
    it('Create has correct title', () => {
      const actions = getWorkflowsActions($t as never);
      expect(actions.Create.title).toBe('create_workflow');
    });

    it('Create has correct icon', () => {
      const actions = getWorkflowsActions($t as never);
      expect(actions.Create.icon).toBe(mdiPlus);
    });

    it('UseTemplate has correct title', () => {
      const actions = getWorkflowsActions($t as never);
      expect(actions.UseTemplate.title).toBe('browse_templates');
    });

    it('UseTemplate has correct icon', () => {
      const actions = getWorkflowsActions($t as never);
      expect(actions.UseTemplate.icon).toBe(mdiFileDocumentMultipleOutline);
    });
  });

  describe('getWorkflowActions', () => {
    it('CopyJson has correct title', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.CopyJson.title).toBe('copy_json');
    });

    it('CopyJson has correct icon', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.CopyJson.icon).toBe(mdiContentCopy);
    });

    it('Download has correct icon', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.Download.icon).toBe(mdiDownload);
    });

    it('Duplicate has correct icon', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.Duplicate.icon).toBe(mdiContentDuplicate);
    });

    it('Edit has correct icon', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.Edit.icon).toBe(mdiPencil);
    });

    it('Delete has correct icon', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.Delete.icon).toBe(mdiDeleteOutline);
    });

    it('Delete has danger color', () => {
      const actions = getWorkflowActions($t as never, workflow);
      expect(actions.Delete.color).toBe('danger');
    });

    it('ToggleEnabled uses play icon when disabled', () => {
      const actions = getWorkflowActions($t as never, {
        ...workflow,
        enabled: false,
      });
      expect(actions.ToggleEnabled.icon).toBe(mdiPlay);
    });

    it('ToggleEnabled uses pause icon when enabled', () => {
      const actions = getWorkflowActions($t as never, {
        ...workflow,
        enabled: true,
      });
      expect(actions.ToggleEnabled.icon).toBe(mdiPause);
    });

    it('ToggleEnabled title is enable when disabled', () => {
      const actions = getWorkflowActions($t as never, {
        ...workflow,
        enabled: false,
      });
      expect(actions.ToggleEnabled.title).toBe('enable');
    });

    it('ToggleEnabled title is disable when enabled', () => {
      const actions = getWorkflowActions($t as never, {
        ...workflow,
        enabled: true,
      });
      expect(actions.ToggleEnabled.title).toBe('disable');
    });
  });

  describe('getWorkflowShowSchemaAction', () => {
    it('uses show_schema title when collapsed', () => {
      const action = getWorkflowShowSchemaAction(
        $t as never,
        false,
        vi.fn(),
      );

      expect(action.title).toBe('show_schema');
    });
  });
});