import { bootstrapCore } from "@cerberus/core/src/bootstrapper.ts";
import { bootstrapOrganizationalStructure } from "@cerberus/organizational-structure/main";
import { bootstrapMaintenance } from "@cerberus/maintenance";
import { setupI18N } from "@uxland/react-services";
import { locales as CA } from './locales/ca/locales.ts';
import { bootstrapSurveillance } from "@cerberus/surveillance";
export const bootstrapApplication = async () => {
    const container = await bootstrapCore()
        .then(bootstrapMaintenance)
        .then(bootstrapOrganizationalStructure)
        .then(bootstrapSurveillance);
    await setupI18N({ ca: CA }, 'ca')
    return container;
}