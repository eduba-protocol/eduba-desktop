

interface Feature {
    Backup: boolean;
}

export class RendererConfig {
    public feature: Feature;

    constructor() {
        this.feature = {
            Backup: process.env.FEATURE_BACKUP === "true" 
        }
    }
}

console.log(new RendererConfig());