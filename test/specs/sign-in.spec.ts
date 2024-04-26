import { browser, expect, $ } from '@wdio/globals'

describe('Sign In', () => {
    let phraseInput: WebdriverIO.Element;

    before(async () => {
        const userTab = await $('#sidebar-tabs [data-tab="UserMenu"]');
        await userTab.click();

        const signInBtn = await $('[data-testid="sign-in"]');
        await signInBtn.click();

        phraseInput = await $('#sign-in-form [name="phrase"]');
    })

    it("should generate a mneumonic phrase for the user", async () => {
        const generateMneumonicBtn = await $('[data-testid="generate-mneumonic"]');
        await generateMneumonicBtn.click();

        await browser.waitUntil(async function () {
            const value = await phraseInput.getValue();
            return !!value;
        }, {
          timeout: 5000,
          timeoutMsg: 'expected phrase to be generated after 5s'
        })

        const value = await phraseInput.getValue();
        expect(value).toBeTruthy();
        const splitPhrase = value.split(" ");
        expect(splitPhrase).toHaveLength(12);
    });

    it("should allow user to sign in with mneumonic phrase", async () => {
        const submitBtn = await $('button[type="submit"]');
        submitBtn.click();
        
        await browser.waitUntil(async () => {
            return (await $('[data-testid="sign-out"]')).isExisting();
        }, {
          timeout: 5000,
          timeoutMsg: 'expected sign out button to be visible after 5s'
        })
    });
})
