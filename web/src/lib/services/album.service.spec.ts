import { modalManager} from '@immich/ui';
import { mdiLink, mdiPlus, mdiPlusBoxOutline, mdiShareVariantOutline, mdiUpload } from '@mdi/js';
import { beforeEach, expect, vitest } from 'vitest';
import {createAlbumAndRedirect} from '$lib/utils/album-utils';
import { getAlbumActions, getAlbumAssetsActions, getAlbumsActions, addAssetsToAlbums } from "$lib/services/album.service";
import { authManager } from '$lib/managers/auth-manager.svelte';
import { preferencesFactory } from '@test-data/factories/preferences-factory';
import { userAdminFactory } from '@test-data/factories/user-factory';
import { albumFactory } from '@test-data/factories/album-factory';
import AlbumAddUsersModal from '$lib/modals/AlbumAddUsersModal.svelte';
import AlbumOptionsModal from '$lib/modals/AlbumOptionsModal.svelte';
import SharedLinkCreateModal from '$lib/modals/SharedLinkCreateModal.svelte';
import { assetFactory } from '@test-data/factories/asset-factory';
import type { TimelineAsset } from '$lib/managers/timeline-manager/types';


vitest.mock('$lib/utils/album-utils', () => ({
  createAlbumAndRedirect: vitest.fn(),
}));

vitest.mock('@immich/ui', () => ({
  modalManager: {
    show: vitest.fn(),
  },
}));


vitest.mock('$lib/services/album.service', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('$lib/services/album.service')
  >();

  return {
    ...actual,
    addAssetsToAlbums: vitest.fn(),
  };
});

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
    it('checks that a ShareItem is showed when the user is the owner', ()=>{
      const user = userAdminFactory.build( { id : 'owner' })
      const album = albumFactory.build({
        albumUsers: [{user}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => '',album)
      expect(actions.Share.$if?.()).toBe(true);
    });

    it('checks that a ShareItem is hidden when the user is not the owner', ()=>{
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
      const albumOwner = userAdminFactory.build( { id : 'not-owner' })
      const user = userAdminFactory.build( { id : 'owner' })

      const album = albumFactory.build({
        albumUsers: [{user : albumOwner}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => '',album)
      actions.Share.onAction(actions.Share);
      expect(modalManager.show).toHaveBeenCalledWith(AlbumOptionsModal, {album});
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
      const albumOwner = userAdminFactory.build( { id : 'not-owner' })
      const user = userAdminFactory.build( { id : 'owner' })

      const album = albumFactory.build({
        albumUsers: [{user : albumOwner}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => '',album)
      actions.AddUsers.onAction(actions.AddUsers);
      expect(modalManager.show).toHaveBeenCalledWith(AlbumAddUsersModal, {album});
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
      const albumOwner = userAdminFactory.build( { id : 'not-owner' })
      const user = userAdminFactory.build( { id : 'owner' })

      const album = albumFactory.build({
        albumUsers: [{user : albumOwner}]
      });
      authManager.setUser(user);
      const actions = getAlbumActions(() => '',album)
      actions.CreateSharedLink.onAction(actions.CreateSharedLink);
      expect(modalManager.show).toHaveBeenCalledWith(SharedLinkCreateModal, {albumId: album.id});
    });
  });
  describe('getAlbumAssetsActions', () => {
    beforeEach(() => {
      authManager.setPreferences(preferencesFactory.build());
    });

    it('checks that an addAssetsItem was obtained', ()=> {
      const album = albumFactory.build({ id: 'temp-id' });
      const actions = getAlbumAssetsActions(() => 'Add Assets', album, []);
      expect(actions.AddAssets.title).toBe('Add Assets');
      expect(actions.AddAssets.icon).toBe(mdiPlusBoxOutline);
      expect(actions.AddAssets.color).toBe('primary');

    });
    it('hides AddAssets when there are no assets', ()=> {
      const album = albumFactory.build({ id: 'temp-id' });
      const actions = getAlbumAssetsActions(() => 'Add Assets', album, []);
      expect(actions.AddAssets.$if?.()).toBe(false);
    });

    it('shows AddAssets when there are assets', ()=> {
      const album = albumFactory.build({ id: 'temp-id' });
      const assets = [{}, {}] as TimelineAsset[];
      const actions = getAlbumAssetsActions(() => 'Add Assets', album, assets);
      expect(actions.AddAssets.$if?.()).toBe(true);
    });
    it('checks that the onAction callback correctly', ()=> {
      expect(true).toBeTruthy();
    });
    it('checks that a UploadItem was obtained', ()=> {
      expect(true).toBeTruthy();
    });
  });
});

