import {bootstrapCore} from "@cerberus/core/src/bootstrapper.ts";
import {bootstrapOrganizationalStructure} from "@cerberus/organizational-structure/main.ts";
import {setupI18N} from "@uxland/react-services";
import {locales as CA} from './locales/ca/locales.ts';
export const bootstrapApplication = async () =>{
    const container = await bootstrapCore();
    await bootstrapOrganizationalStructure(container);
    await setupI18N({ca: CA}, 'ca')
}