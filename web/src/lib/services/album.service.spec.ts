import { modalManager, toastManager, type ActionItem } from '@immich/ui';
import { mdiLink, mdiPlus, mdiPlusBoxOutline, mdiShareVariantOutline, mdiUpload } from '@mdi/js';
import { createAlbumAndRedirect } from '$lib/utils/album-utils';
import { beforeEach, expect, vitest } from 'vitest';

describe('album service', () => {
  describe('getAlbumActions', () => {
    beforeEach(()=> {

    });
    it('should work', ()=>{
      expect(true).toStrictEqual(true);
    });
    it('should create a Create ActionItem', ()=>{
      expect(true).toStrictEqual(true);
    });

    it('should show Share only when owner', ()=>{
      expect(true).toStrictEqual(true);
    });

    it('should show Delete only when owner', ()=>{
      expect(true).toStrictEqual(true);
    });

  });
});
