import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
	console.log('createComponentInstance', parent)
	const component = {
		type: vnode.type,
    vnode,
		slots: {},
		setupState: {},
		provides: parent ? parent.provides : {},
		parent,
		emit: () => {}
	}
	component.emit = emit.bind(null, component) as any
	return component;
}

export function setupComponent(instance) {

	initProps(instance, instance.vnode.props);
	initSlots(instance, instance.vnode.children)
	setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
	instance.proxy =  new Proxy({_: instance}, PublicInstanceProxyHandlers)
	const Component = instance.type;
	const { setup } = Component
	if(setup) {
		setCurrentInstance(instance);
		const setupResult = setup(shallowReadonly(instance.props), {
			emit: instance.emit
		})
		setCurrentInstance(null);
		handleSetupResult(instance, setupResult)
	}
}
function handleSetupResult(instance, setupResult: any) {
	// @TODO function和object两种
	if(typeof setupResult === 'object') {
		instance.setupState = setupResult
	}

	finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
	const Component = instance.type;
	// if(Component.render) {
		instance.render = Component.render
	// }
}

let currentInstance = null;
export function getCurrentInstance() {
	return currentInstance;
}

export function setCurrentInstance(instance) {
	currentInstance = instance
}

