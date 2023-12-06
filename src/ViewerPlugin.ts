// Entry point for the plugin system
import type { App } from "vue";
import { SpecialUploader } from "./components";

// Install hook. Allows us to do global import in main.ts
// e.g. app.use(ViewerPlugin);
export default {
    // Install with options
    install: (app: App, options: { img: string } = { img: "" }) => {
        app.component("SpecialUploader", SpecialUploader);
        // Inject patern. Add data without using props
        app.provide("specialUploadImage", options.img);
    },
};

// Accommodate import, as opposed to use globally
export { SpecialUploader };