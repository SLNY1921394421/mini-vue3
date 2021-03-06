const publicPropertiesMap = {
	$el: (i) => i.vnode.el,
	$slots: (i) => i.slots
}
export const PublicInstanceProxyHandlers = {
	get({_: instance}, key) {
		const { setupState, props } = instance;

		// if(key in setupState) {
		// 	return setupState[key]
		// }

		const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

		if(hasOwn(setupState, key)) {
			return setupState[key]
		}

		if(hasOwn(props, key)) {
			return props[key]
		}



		// debugger;
		// if(key === '$el') {
		// 	return instance.vnode.el
		// }
		const publicGetter = publicPropertiesMap[key];
		if(publicGetter) {
			return publicGetter(instance);
		}
	}
};