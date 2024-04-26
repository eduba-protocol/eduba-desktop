import { browser, expect } from '@wdio/globals'

describe('Landing screen', () => {
    it('should have Eduba as browser title', async () => {
        expect(browser).toHaveTitle("Eduba");
    })
})
