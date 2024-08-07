import "reflect-metadata";
import getDecorators from "inversify-inject-decorators";
import { Container } from "inversify";
const container = new Container()
const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = getDecorators(container, false);

export{
    container,
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject
}