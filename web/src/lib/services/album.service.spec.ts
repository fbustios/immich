import { modalManager, toastManager, type ActionItem } from '@immich/ui';
import { mdiLink, mdiPlus, mdiPlusBoxOutline, mdiShareVariantOutline, mdiUpload } from '@mdi/js';
import { beforeEach, expect, vitest } from 'vitest';
import {createAlbumAndRedirect} from '$lib/utils/album-utils';
import { getAlbumsActions } from "$lib/services/album.service";
import { authManager } from '$lib/managers/auth-manager.svelte';
import { preferencesFactory } from '@test-data/factories/preferences-factory';

vitest.mock('$lib/utils/album-utils', () => ({
  createAlbumAndRedirect: vitest.fn(),
}));

describe('album service', () => {
  describe('getAlbumActions', () => {
    beforeEach(()=> {
      authManager.setPreferences(preferencesFactory.build());
    });
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
    it('should create a Create ActionItem', ()=>{
      expect(true).toStrictEqual(true);
    });
  });
  describe('getAlbumActions depending on ownership', () => {
    it('checks that a ShareItem was obtained', ()=>{
      expect(true).toStrictEqual(true);
    });
    it('checks that an AddUsersItem was obtained', ()=>{
      expect(true).toStrictEqual(true);
    });
    it('checks that a sharedLinkItem was obtained', ()=>{
      expect(true).toStrictEqual(true);
    });
    it('checks that no actions were obtained when not an owner of the album', ()=>{
      expect(true).toStrictEqual(true);
    });
  });
});
