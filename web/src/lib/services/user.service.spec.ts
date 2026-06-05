import { changePassword, lockAuthSession, resetPinCode } from '@immich/sdk';
import { mdiLockOutline } from '@mdi/js';
import { vitest, expect, beforeEach } from 'vitest';
import { eventManager } from '$lib/managers/event-manager.svelte';
import { getUserActions, handleResetPinCode, handleChangePassword } from '$lib/services/user.service';

vitest.mock('@immich/ui', () => ({
  toastManager: {
    primary: vitest.fn(),
    danger: vitest.fn(),
  },
}));

vitest.mock('@immich/sdk', () => ({
  changePassword: vitest.fn(),
  lockAuthSession: vitest.fn(),
  resetPinCode: vitest.fn(),
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
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('user service', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  describe('getUserActions - LockSession', () => {
    it('has the correct icon', () => {
      const actions = getUserActions($t as any);
      expect(actions.LockSession.icon).toBe(mdiLockOutline);
    });

    it('has the correct title', () => {
      const actions = getUserActions($t as any);
      expect(actions.LockSession.title).toBe('lock');
    });

    it('has the primary color', () => {
      const actions = getUserActions($t as any);
      expect(actions.LockSession.color).toBe('primary');
    });

    it('calls lockAuthSession on action', async () => {
      const actions = getUserActions($t as any);
      actions.LockSession.onAction(actions.LockSession);
      await flushPromises();
      expect(lockAuthSession).toHaveBeenCalled();
    });
  });

  describe('handleResetPinCode', () => {
    it('calls resetPinCode with the dto', async () => {
      const dto = { pinCode: '123456' };
      await handleResetPinCode(dto as any);
      expect(resetPinCode).toHaveBeenCalledWith({ pinCodeResetDto: dto });
    });

    it('returns true on success', async () => {
      const result = await handleResetPinCode({ pinCode: '123456' } as any);
      expect(result).toBe(true);
    });

    it('emits UserPinCodeReset on success', async () => {
      await handleResetPinCode({ pinCode: '123456' } as any);
      expect(eventManager.emit).toHaveBeenCalledWith('UserPinCodeReset');
    });
  });

  describe('handleChangePassword', () => {
    it('calls changePassword with the dto', async () => {
      const dto = { password: 'old-password', newPassword: 'new-password' };
      await handleChangePassword(dto as any);
      expect(changePassword).toHaveBeenCalledWith({ changePasswordDto: dto });
    });

    it('returns true on success', async () => {
      const result = await handleChangePassword({ password: 'old-password', newPassword: 'new-password' } as any);
      expect(result).toBe(true);
    });
  });
});
