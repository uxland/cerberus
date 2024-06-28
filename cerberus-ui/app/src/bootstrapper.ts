import {bootstrapCore} from "@cerberus/core/src/bootstrapper.ts";
import {bootstrapOrganizationalStructure} from "@cerberus/organizational-structure/main";
import {boostrapMaintenance} from "@cerberus/maintenance";
import {setupI18N} from "@uxland/react-services";
import {locales as CA} from './locales/ca/locales.ts';
export const bootstrapApplication = async () =>{
    await bootstrapCore()
        .then(boostrapMaintenance)
        .then(bootstrapOrganizationalStructure);
    await setupI18N({ca: CA}, 'ca')
}