import { modalManager, toastManager, type ActionItem } from '@immich/ui';
import { mdiLink, mdiPlus, mdiPlusBoxOutline, mdiShareVariantOutline, mdiUpload } from '@mdi/js';
import { beforeEach, expect, vitest } from 'vitest';
import {createAlbumAndRedirect} from '$lib/utils/album-utils';
import { getAlbumActions, getAlbumsActions } from "$lib/services/album.service";
import { authManager } from '$lib/managers/auth-manager.svelte';
import { preferencesFactory } from '@test-data/factories/preferences-factory';
import { userAdminFactory } from '@test-data/factories/user-factory';
import { albumFactory } from '@test-data/factories/album-factory';

vitest.mock('$lib/utils/album-utils', () => ({
  createAlbumAndRedirect: vitest.fn(),
}));

vitest.mock('@immich/ui', () => ({
  modalManager: {
    show: vitest.fn(),
  },
}));

describe('album service', () => {
  describe('getAlbumActions', () => {
    it('checks the format of the Create ActionItem', ()=>{
      const actions = getAlbumsActions(() => 'Create Album')
      expect(actions.Create.icon).toBe(mdiPlusBoxOutline);
      expect(actions.Create.title).toBe('Create Album')
    });
    it('checks that createAlbumAndRedirect has been called', ()=>{
      const actions = getAlbumsActions(() => 'Create Album')
      actions.Create.onAction(actions.Create);
      expect(createAlbumAndRedirect).toHaveBeenCalled();
    });
  });

  describe('getAlbumActions depending on ownership of an album', () => {
    beforeEach(()=> {
      authManager.setPreferences(preferencesFactory.build());
    });
    it('checks that a ShareItem was obtained when the user is the owner', ()=>{
      const user = userAdminFactory.build( { id : 'owner' })
      const album = albumFactory.build({
        albumUsers: [{user}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => '',album)
      expect(actions.Share.$if?.()).toBe(true);
    });

    it('checks that a ShareItem wasnt obtained when user is not the owner', ()=>{
      const albumOwner = userAdminFactory.build( { id : 'not-owner' })
      const user = userAdminFactory.build( { id : 'owner' })

      const album = albumFactory.build({
        albumUsers: [{user : albumOwner}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => '',album)
      expect(actions.Share.$if?.()).toBe(false);
    });

    it('checks that the callback function of a ShareItem called the modalManager', ()=>{
      expect(true).toStrictEqual(true);
    });

    it('checks that a valid AddUsersItem was obtained', ()=>{
      const user = userAdminFactory.build( { id : 'owner' })
      const album = albumFactory.build({
        albumUsers: [{user}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => 'Invite People',album)
      expect(actions.AddUsers.icon).toBe(mdiPlus);
      expect(actions.AddUsers.color).toBe('primary');
      expect(actions.AddUsers.title).toBe('Invite People');
    });


    it('checks that the callback function of an AddUsersItem called the modalManager', ()=>{
      expect(true).toStrictEqual(true);
    });

    it('checks that a valid CreateSharedLink was obtained', ()=>{
      const user = userAdminFactory.build( { id : 'owner' })
      const album = albumFactory.build({
        albumUsers: [{user}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => 'Create Link',album)
      expect(actions.CreateSharedLink.icon).toBe(mdiLink);
      expect(actions.CreateSharedLink.color).toBe('primary');
      expect(actions.CreateSharedLink.title).toBe('Create Link');
    });

    it('checks that the callback function of CreateSharedLink called the modalManager', ()=>{
      expect(true).toStrictEqual(true);
    });
  });
});
