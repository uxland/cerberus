import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
const container = new Container()
const { lazyInject, lazyInjectNamed, lazyInjectTagged, lazyMultiInject } = getDecorators(container, false);

export{
    container,
    lazyInject,
    lazyInjectNamed,
    lazyInjectTagged,
    lazyMultiInject
}