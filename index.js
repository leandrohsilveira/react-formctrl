!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports["react-formctrl"]=t(require("react")):e["react-formctrl"]=t(e.react)}(this,function(e){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,n){"use strict";function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.FormProvider=t.FormEventDispatcher=t.REACT_FORMCTRL=void 0;var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),d=function(e){return e&&e.__esModule?e:{default:e}}(u),l=t.REACT_FORMCTRL={EVENTS:{REGISTER_FORM:"react-formctl.registerForm",UNREGISTER_FORM:"react-formctl.unregisterForm",REGISTER_FIELD:"react-formctl.registerField",UNREGISTER_FIELD:"react-formctl.unregisterField",FORM_CHANGED:"react-formctl.formChanged",FIELD_CHANGED:"react-formctl.fieldChanged",FORM_SUBMITED:"react-formctl.formSubmited",FORM_RESETED:"react-formctl.formReseted"}},c=t.FormEventDispatcher=function(){function e(){o(this,e)}return s(e,null,[{key:"dispatchRegisterForm",value:function(e){var t={detail:{form:e}},n=new CustomEvent(l.EVENTS.REGISTER_FORM,t);document.dispatchEvent(n)}},{key:"dispatchUnregisterForm",value:function(e){var t={detail:{form:e}},n=new CustomEvent(l.EVENTS.UNREGISTER_FORM,t);document.dispatchEvent(n)}},{key:"dispatchSubmitForm",value:function(e,t){var n={detail:{form:e,formRef:t}},r=new CustomEvent(l.EVENTS.FORM_SUBMITED,n);document.dispatchEvent(r)}},{key:"dispatchResetForm",value:function(e){var t={detail:{form:e}},n=new CustomEvent(l.EVENTS.FORM_RESETED,t);document.dispatchEvent(n)}},{key:"dispatchRegisterField",value:function(e,t,n){var r={detail:{form:e,field:t,fieldCtrl:n}},i=new CustomEvent(l.EVENTS.REGISTER_FIELD,r);document.dispatchEvent(i)}},{key:"dispatchUnregisterField",value:function(e,t){var n={detail:{form:e,field:t}},r=new CustomEvent(l.EVENTS.UNREGISTER_FIELD,n);document.dispatchEvent(r)}},{key:"dispatchFieldChanged",value:function(e,t,n){var r={detail:{form:e,field:t,fieldCtrl:n}},i=new CustomEvent(l.EVENTS.FIELD_CHANGED,r);document.dispatchEvent(i)}},{key:"forwardSubmitFormEvent",value:function(e,t,n,r){var i={detail:{values:t,formCtrl:n,formRef:r}},o=new CustomEvent(l.EVENTS.FORM_SUBMITED+"#"+e,i);document.dispatchEvent(o)}},{key:"forwardResetFormEvent",value:function(e){var t=new CustomEvent(l.EVENTS.FORM_RESETED+"#"+e);document.dispatchEvent(t)}},{key:"forwardFieldChangedEvent",value:function(e,t,n){var r={detail:{form:e,field:t,fieldCtrl:n}},i=new CustomEvent(l.EVENTS.FIELD_CHANGED+"#"+e+"#"+t,r);document.dispatchEvent(i)}},{key:"forwardFormChangedEvent",value:function(e,t){var n={detail:{form:e,formCtrl:t}},r=new CustomEvent(l.EVENTS.FORM_CHANGED+"#"+e,n);document.dispatchEvent(r)}}]),e}();t.FormProvider=function(e){function t(e){o(this,t);var n=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={forms:{}},n.subscribe=n.subscribe.bind(n),n.unsubscribe=n.unsubscribe.bind(n),n.onEvent=n.onEvent.bind(n),n.onRegisterForm=n.onRegisterForm.bind(n),n.onUnregisterForm=n.onUnregisterForm.bind(n),n.onRegisterField=n.onRegisterField.bind(n),n.onUnregisterField=n.onUnregisterField.bind(n),n.onFieldChanged=n.onFieldChanged.bind(n),n.onFormSubmited=n.onFormSubmited.bind(n),n.onFormReseted=n.onFormReseted.bind(n),n.updateFormCtrl=n.updateFormCtrl.bind(n),n}return i(t,e),s(t,[{key:"componentWillMount",value:function(){this.subscribe()}},{key:"componentWillUnmount",value:function(){this.unsubscribe()}},{key:"subscribe",value:function(){document.addEventListener(l.EVENTS.REGISTER_FORM,this.onEvent),document.addEventListener(l.EVENTS.REGISTER_FIELD,this.onEvent),document.addEventListener(l.EVENTS.UNREGISTER_FORM,this.onEvent),document.addEventListener(l.EVENTS.UNREGISTER_FIELD,this.onEvent),document.addEventListener(l.EVENTS.FIELD_CHANGED,this.onEvent),document.addEventListener(l.EVENTS.FORM_SUBMITED,this.onEvent),document.addEventListener(l.EVENTS.FORM_RESETED,this.onEvent)}},{key:"onEvent",value:function(e){var t=e.type,n=e.detail,r=l.EVENTS;switch(t){case r.REGISTER_FORM:this.onRegisterForm(n.form);break;case r.UNREGISTER_FORM:this.onUnregisterForm(n.form);break;case r.REGISTER_FIELD:this.onRegisterField(n.form,n.field,n.fieldCtrl);break;case r.UNREGISTER_FIELD:this.onUnregisterField(n.form,n.field);break;case r.FIELD_CHANGED:this.onFieldChanged(n.form,n.field,n.fieldCtrl);break;case r.FORM_SUBMITED:this.onFormSubmited(n.form,n.formRef);break;case r.FORM_RESETED:this.onFormReseted(n.form)}}},{key:"onRegisterForm",value:function(e){this.setState(function(t){var n=a({},t.forms);if(n[e]){n[e].__instances++}else n[e]={__instances:1,valid:!0,invalid:!1,untouched:!0,touched:!1,pristine:!0,dirty:!1,unchanged:!0,changed:!1,fields:{},values:{}};return{forms:n}})}},{key:"onRegisterField",value:function(e,t,n){var r=this;this.setState(function(i){if(i.forms[e]){var o=a({},i.forms),s=o[e];s.fields[t]=n,r.updateFormCtrl(e,s);var u=s.fields[t];return s.values[t]=u.value,u.__instances?u.__instances++:u.__instances=1,c.forwardFieldChangedEvent(e,t,u),{forms:o}}return console.warn('No form instance with name "'+e+'" to register field "'+t+'".'),i})}},{key:"onUnregisterForm",value:function(e){this.setState(function(t){if(t.forms[e]){var n=a({},t.forms),r=n[e];return r.__instances>1?r.__instances--:delete n[e],{forms:n}}return t})}},{key:"onUnregisterField",value:function(e,t){this.setState(function(n){if(n.forms[e]&&n.forms[e].fields[t]){var r=a({},n.forms),i=r[e],o=i.fields[t];return o.__instances>1?o.__instances--:delete i.fields[t],{forms:r}}return n})}},{key:"onFieldChanged",value:function(e,t,n){var r=this;this.setState(function(i){if(i.forms[e]&&i.forms[e].fields[t]){var o=a({},i.forms),s=o[e];return s.values||(s.values={}),s.values[t]=n.value,s.fields[t]=a({},n),r.updateFormCtrl(e,s),c.forwardFieldChangedEvent(e,t,s.fields[t]),{forms:o}}return i})}},{key:"updateFormCtrl",value:function(e,t){t.valid=!0,t.invalid=!1,t.untouched=!0,t.touched=!1,t.pristine=!0,t.dirty=!1,t.unchanged=!0,t.changed=!1,Object.keys(t.fields).forEach(function(e){var n=t.fields[e];n.valid||(t.valid=!1),n.invalid&&(t.invalid=!0),n.untouched||(t.untouched=!1),n.touched&&(t.touched=!0),n.pristine||(t.pristine=!1),n.dirty&&(t.dirty=!0),n.unchanged||(t.unchanged=!1),n.changed&&(t.changed=!0)}),c.forwardFormChangedEvent(e,t)}},{key:"onFormSubmited",value:function(e,t){this.setState(function(n){var r=n.forms[e];return r&&c.forwardSubmitFormEvent(e,r.values,r,t),n})}},{key:"onFormReseted",value:function(e){c.forwardResetFormEvent(e)}},{key:"unsubscribe",value:function(){document.removeEventListener(l.EVENTS.REGISTER_FORM,this.onEvent),document.removeEventListener(l.EVENTS.REGISTER_FIELD,this.onEvent),document.removeEventListener(l.EVENTS.UNREGISTER_FORM,this.onEvent),document.removeEventListener(l.EVENTS.UNREGISTER_FIELD,this.onEvent),document.removeEventListener(l.EVENTS.FIELD_CHANGED,this.onEvent),document.removeEventListener(l.EVENTS.FORM_SUBMITED,this.onEvent),document.removeEventListener(l.EVENTS.FORM_RESETED,this.onEvent)}},{key:"render",value:function(){return this.props.children}}]),t}(d.default.Component)},function(t,n){t.exports=e},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);Object.defineProperty(t,"REACT_FORMCTL",{enumerable:!0,get:function(){return r.REACT_FORMCTL}}),Object.defineProperty(t,"FormEventDispatcher",{enumerable:!0,get:function(){return r.FormEventDispatcher}}),Object.defineProperty(t,"FormProvider",{enumerable:!0,get:function(){return r.FormProvider}});var i=n(3);Object.defineProperty(t,"Form",{enumerable:!0,get:function(){return i.Form}}),Object.defineProperty(t,"FormControl",{enumerable:!0,get:function(){return i.FormControl}});var o=n(4);Object.defineProperty(t,"Field",{enumerable:!0,get:function(){return o.Field}})},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.FormControl=t.Form=void 0;var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),d=function(e){return e&&e.__esModule?e:{default:e}}(u),l=n(0);t.Form=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleSubmit=n.handleSubmit.bind(n),n.handleReset=n.handleReset.bind(n),n.handleFormSubmitForward=n.handleFormSubmitForward.bind(n),n}return o(t,e),s(t,[{key:"handleSubmit",value:function(e){var t=this.props.name;e.preventDefault(),l.FormEventDispatcher.dispatchSubmitForm(t,this)}},{key:"handleReset",value:function(e){var t=this.props.name;e.preventDefault(),l.FormEventDispatcher.dispatchResetForm(t)}},{key:"componentWillMount",value:function(){var e=this.props,t=e.name,n=e.initialValues;document.addEventListener(l.REACT_FORMCTRL.EVENTS.FORM_SUBMITED+"#"+t,this.handleFormSubmitForward),l.FormEventDispatcher.dispatchRegisterForm(t,n)}},{key:"handleFormSubmitForward",value:function(e){var t=this.props.onSubmit;if("function"==typeof t){var n=e.detail,r=n.values,i=n.formCtrl;n.formRef==this&&t(r,i)}}},{key:"componentWillUnmount",value:function(){document.removeEventListener(l.REACT_FORMCTRL.EVENTS.FORM_SUBMITED+"#"+props.name,this.handleFormSubmitForward),l.FormEventDispatcher.dispatchUnregisterForm(props.name)}},{key:"render",value:function(){var e=this.handleSubmit,t=this.handleReset,n=this.props,r=n.name,i=n.children,o=n.className;return d.default.createElement("form",{id:r,name:r,className:o,onSubmit:e,onReset:t,noValidate:!0},i)}}]),t}(d.default.Component),t.FormControl=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={valid:!0,invalid:!1,untouched:!0,touched:!1,pristine:!0,dirty:!1,unchanged:!0,changed:!1,fields:{},values:{}},n.handleFormChanged=n.handleFormChanged.bind(n),n.sync=n.sync.bind(n),n.transformProps=n.transformProps.bind(n),n}return o(t,e),s(t,[{key:"componentWillMount",value:function(){var e=this.props,t=e.form,n=e.children;if(Array.isArray(n)&&n.length>1)throw'The FormControl component for "'+t+'" should have only one child, but has '+n.length+".";document.addEventListener(l.REACT_FORMCTRL.EVENTS.FORM_CHANGED+"#"+t,this.handleFormChanged)}},{key:"componentWillUnmount",value:function(){var e=this.props.form;document.removeEventListener(l.REACT_FORMCTRL.EVENTS.FORM_CHANGED+"#"+e,this.handleFormChanged)}},{key:"handleFormChanged",value:function(e){var t=e.detail,n=(this.props.form,t.formCtrl),r=this.sync(n);Object.keys(r).length>0&&this.setState(r)}},{key:"sync",value:function(e){var t={};return JSON.stringify(this.state.values)!==JSON.stringify(e.values)&&(t.values=e.values),JSON.stringify(this.state.fields)!==JSON.stringify(e.fields)&&(t.fields=e.fields),this.state.valid!==e.valid&&(t.valid=e.valid),this.state.invalid!==e.invalid&&(t.invalid=e.invalid),this.state.untouched!==e.untouched&&(t.untouched=e.untouched),this.state.touched!==e.touched&&(t.touched=e.touched),this.state.pristine!==e.pristine&&(t.pristine=e.pristine),this.state.dirty!==e.dirty&&(t.dirty=e.dirty),this.state.unchanged!==e.unchanged&&(t.unchanged=e.unchanged),this.state.changed!==e.changed&&(t.changed=e.changed),t}},{key:"transformProps",value:function(){var e=this.props.transformProps;return"function"==typeof e?e(this.state):this.state}},{key:"render",value:function(){var e=this.props.children,t=e;return Array.isArray(e)&&(t=e[0]),d.default.cloneElement(t,a({},t.props,this.transformProps()))}}]),t}(d.default.Component)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.Field=void 0;var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),d=function(e){return e&&e.__esModule?e:{default:e}}(u),l=n(0),c=/^-?\d+?$/,h=/^-?\d+(\.\d+)?$/,f=/\S+@\S+\.\S+/;t.Field=function(e){function t(e){r(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={valid:!0,invalid:!1,untouched:!0,touched:!1,pristine:!0,dirty:!1,unchanged:!0,changed:!1,errors:[],value:"",initialValue:e.initialValue},n.handleFieldChangeForward=n.handleFieldChangeForward.bind(n),n.handleFormResetForward=n.handleFormResetForward.bind(n),n.handleChange=n.handleChange.bind(n),n.handleBlur=n.handleBlur.bind(n),n.updateFieldCtrl=n.updateFieldCtrl.bind(n),n.getChildProps=n.getChildProps.bind(n),n.transformProps=n.transformProps.bind(n),n.sync=n.sync.bind(n),n}return o(t,e),s(t,[{key:"componentWillMount",value:function(){var e=this.props,t=e.form,n=e.name,r=e.children,i=e.initialValue,o=void 0===i?"":i;if(Array.isArray(r)&&r.length>1)throw'The Field component for "'+t+"#"+n+'" should have only one child, but has '+r.length+".";document.addEventListener(l.REACT_FORMCTRL.EVENTS.FIELD_CHANGED+"#"+t+"#"+n,this.handleFieldChangeForward),document.addEventListener(l.REACT_FORMCTRL.EVENTS.FORM_RESETED+"#"+t,this.handleFormResetForward);var a=this.updateFieldCtrl(o);a.value=o,l.FormEventDispatcher.dispatchRegisterField(t,n,a)}},{key:"componentWillUnmount",value:function(){var e=this.props,t=e.form,n=e.name;document.removeEventListener(l.REACT_FORMCTRL.EVENTS.FIELD_CHANGED+"#"+t+"#"+n,this.handleFieldChangeForward),document.removeEventListener(l.REACT_FORMCTRL.EVENTS.FORM_RESETED+"#"+t,this.handleFormResetForward),l.FormEventDispatcher.dispatchUnregisterField(t,n)}},{key:"updateFieldCtrl",value:function(e){var t=[],n=this.props,r=(n.form,n.name,n.type),i=n.required,o=n.pattern,s=(n.match,n.integer),u=n.min,d=n.max,l=n.minLength,m=n.maxLength,v=n.initialValue,E=void 0===v?"":v;return i&&!e?t.push("required"):o&&!new RegExp(o).test(e)?t.push("pattern"):("email"!==r||f.test(e)||t.push("email"),"number"===r?(s&&!c.test(e)&&t.push("integer"),s||h.test(e)||t.push("float"),u&&+e<u&&t.push("min"),d&&+e>d&&t.push("max")):(l&&e&&e.length<l&&t.push("minLength"),m&&e&&e.length>m&&t.push("maxLength"))),a({},this.state,{errors:t,unchanged:e===E,changed:e!==E,valid:0===t.length,invalid:t.length>0})}},{key:"handleFieldChangeForward",value:function(e){var t=e.detail,n=t.fieldCtrl,r=this.sync(n);Object.keys(r).length&&this.setState(r)}},{key:"handleFormResetForward",value:function(e){var t=this.props,n=t.form,r=t.name,i=(t.children,t.initialValue),o=void 0===i?"":i,a=this.updateFieldCtrl(o);a.value=o,a.pristine=!0,a.dirty=!1,a.untouched=!0,a.touched=!1,l.FormEventDispatcher.dispatchFieldChanged(n,r,a)}},{key:"handleChange",value:function(e){var t=this.updateFieldCtrl,n=this.sync,r=this.props,i=r.form,o=r.name,a=e.target.value,s=t(a);s.value=a,s.pristine=!1,s.dirty=!0;var u=n(s);Object.keys(u).length&&l.FormEventDispatcher.dispatchFieldChanged(i,o,s)}},{key:"handleBlur",value:function(e){if(this.state.untouched){var t=this.props,n=t.form,r=t.name;l.FormEventDispatcher.dispatchFieldChanged(n,r,a({},this.state,{touched:!0,untouched:!1}))}}},{key:"sync",value:function(e){var t={};return JSON.stringify(this.state.errors)!==JSON.stringify(e.errors)&&(t.errors=e.errors),this.state.valid!==e.valid&&(t.valid=e.valid),this.state.invalid!==e.invalid&&(t.invalid=e.invalid),this.state.untouched!==e.untouched&&(t.untouched=e.untouched),this.state.touched!==e.touched&&(t.touched=e.touched),this.state.pristine!==e.pristine&&(t.pristine=e.pristine),this.state.dirty!==e.dirty&&(t.dirty=e.dirty),this.state.unchanged!==e.unchanged&&(t.unchanged=e.unchanged),this.state.changed!==e.changed&&(t.changed=e.changed),this.state.value!==e.value&&(t.value=e.value),t}},{key:"getChildProps",value:function(){var e={};return e.name=this.props.name,e.ctrl={valid:this.state.valid,invalid:this.state.invalid,untouched:this.state.untouched,touched:this.state.touched,pristine:this.state.pristine,dirty:this.state.dirty,unchanged:this.state.unchanged,changed:this.state.changed,errors:this.state.errors},e.className=this.props.className,e.value=this.state.value,e.required=this.props.required,e.pattern=this.props.pattern,e.type=this.props.type||"text",e.onChange=this.handleChange,e.onBlur=this.handleBlur,e}},{key:"transformProps",value:function(e){var t=this.props.transformProps,n=this.getChildProps();return"function"==typeof t?t(n):n}},{key:"render",value:function(){var e=(this.getChildProps,this.transformProps),t=this.props.children,n=t;return Array.isArray(t)&&(n=t[0]),d.default.cloneElement(n,a({},n.props,e()))}}]),t}(d.default.Component)}])});