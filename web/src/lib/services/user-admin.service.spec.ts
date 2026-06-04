import { modalManager, toastManager, type ActionItem } from '@immich/ui';
import {
  mdiDeleteRestore,
  mdiInformationOutline,
  mdiLockReset,
  mdiLockSmart,
  mdiPencilOutline,
  mdiPlusBoxOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
import { serverConfigManager } from '$lib/managers/server-config-manager.svelte';
import { beforeEach, expect, vitest } from 'vitest';
import { authManager } from '$lib/managers/auth-manager.svelte';
import { preferencesFactory } from '@test-data/factories/preferences-factory';
import { userAdminFactory } from '@test-data/factories/user-factory';
import { getUserAdminActions } from '$lib/services/user-admin.service';

vitest.mock('@immich/ui', () => ({
  modalManager: {
    show: vitest.fn(),
    showDialog: vitest.fn(),
  },
  toastManager: {
    primary: vitest.fn(),
  },
}));

vitest.mock('$lib/managers/server-config-manager.svelte', () => ({
  serverConfigManager: {
    value: {
      userDeleteDelay: 7,
    },
  },
}));

describe('user-admin service', ()=>{
  describe('getUserAdminActions', () => {
    beforeEach(()=> {
      authManager.setPreferences(preferencesFactory.build());
    });
    const setupUser = () => {
      const user = userAdminFactory.build({ id: 'owner' , deletedAt: ''});
      authManager.setUser(user);
      return user;
    };

    it('checks that a valid Update action item was returned', () => {
      const user = setupUser();
      const actions = getUserAdminActions(() => 'edit', user);
      expect(actions.Update).toEqual(
        expect.objectContaining({
          title: 'edit',
          icon: mdiPencilOutline,
        }),
      );
    });
    it('checks that a valid Detail ActionItem was returned', ()=>{
      const user = setupUser();
      const actions = getUserAdminActions(() => 'details', user)
      expect(actions.Detail).toEqual(
        expect.objectContaining({
          title: 'details',
          icon: mdiInformationOutline,
        }),
      );
    });

    it('checks that a valid Delete ActionItem was returned', ()=>{
      const user = setupUser();
      const actions = getUserAdminActions(() => 'delete', user)
      expect(actions.Delete).toEqual(
        expect.objectContaining({
          title: 'delete',
          icon: mdiTrashCanOutline,
          color: 'danger',
          shortcuts: { key: 'Backspace' },
          shortcutOptions: { ignoreInputFields: true },
        }),
      );
    });

    it('checks that the Delete ActionItem is hidden when the user is the one logged in or the user is deleted', ()=> {
      const user = setupUser();
      const actions = getUserAdminActions(() => 'delete', user)
      actions.Delete.onAction(actions.Delete);
      expect(actions.Delete.$if?.()).toBeFalsy();
    })
    it('checks that the Delete ActionItem is not hidden when the user is not the one logged in', ()=> {
      const loggedUser = setupUser();
      const user = userAdminFactory.build({ id: 'different' , deletedAt: ''});
      const actions = getUserAdminActions(() => 'delete', user)
      actions.Delete.onAction(actions.Delete);
      expect(actions.Delete.$if?.()).toBeTruthy();
    })

    it('checks that a valid RessetPassword ActionItem was returned', ()=>{
      const user = setupUser();
      const actions = getUserAdminActions(() => 'Reset Password', user)
      expect(actions.ResetPassword).toEqual(
        expect.objectContaining({
          title: 'Reset Password',
          icon: mdiLockReset,
        }),
      );
    });

    it('checks that the ResetPassword ActionItem is hidden to the logged in user', ()=>{
      const loggedUser = setupUser();
      const actions = getUserAdminActions(() => 'Reset Password', loggedUser)
      actions.ResetPassword.onAction(actions.ResetPassword);
      expect(actions.ResetPassword.$if?.()).toBeFalsy();
    });
  });
});
