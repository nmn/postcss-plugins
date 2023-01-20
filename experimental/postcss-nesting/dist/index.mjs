import e from"postcss-selector-parser";function t(e){if(!e.nodes.length)return void e.remove();const t=e.nodes.filter((e=>"comment"===e.type));t.length===e.nodes.length&&e.replaceWith(...t)}function n(e,n){const o=n.index(e);if(o){const e=n.cloneBefore().removeAll().append(n.nodes.slice(0,o));e.raws.semicolon=!0,t(e)}n.before(e),n.raws.semicolon=!0}function o(e){let t=-1;e.each(((n,o)=>{if("decl"===n.type){if(-1===t)return void(t=o);if(t===o-1)return void(t=o);n.remove(),e.insertAfter(t,n),t=e.index(n)}}))}function r(r,s,c){let i=[];try{i=function(t,n,o,r){const s=[];if(0===r.length)return;const c=e().astSync(`:is(${o.join(",")})`);for(let o=0;o<r.length;o++){const i=e().astSync(r[o]);if(!i)continue;let l=!1;if(i.walk((e=>{"nesting"===e.type&&(l=!0)})),!l){const s=i.nodes[0];let c=!1;if(s.each((e=>"combinator"===e.type&&(c=!0,!1))),0===o){let e=!1;s.each((t=>"tag"===t.type&&(e=!0,!1))),e&&t.warn(n,`Invalid nested rule : "${r[o]}"`)}c||s.insertBefore(s.at(0),e.combinator({value:" "})),s.insertBefore(s.at(0),e.nesting({}))}i.walk((e=>{"nesting"===e.type&&e.replaceWith(c.clone({}))})),s.push(i.toString())}return s}(r,c,s.selectors,r.selectors)}catch(e){return void r.warn(c,`Failed to transform selectors : "${s.selector}" / "${r.selector}" with message: "${e.message}"`)}o(s),n(r,s),r.selectors=i;"rule"===r.type&&"rule"===s.type&&r.selector===s.selector&&r.append(...s.nodes),t(s)}var s=["container","document","media","supports","layer"];function c(e){const t=[];let n="",o=!1,r=0,s=!1,c=!1;for(const i of e)c?c=!1:"\\"===i?c=!0:s?i===s&&(s=!1):'"'===i||"'"===i?s=i:"("===i?r+=1:")"===i?r>0&&(r-=1):0===r&&","===i&&(o=!0),o?(""!==n&&t.push(n.trim()),n="",o=!1):n+=i;return t.push(n.trim()),t}function i(e,r){var s,i;o(r),n(e,r),e.params=(s=r.params,i=e.params,c(s).map((e=>c(i).map((t=>`${e} and ${t}`)).join(", "))).join(", ")),t(r)}function l(e){return e&&"atrule"===e.type}function a(e){return e&&"rule"===e.type}function u(e,c){e.each((e=>{const p=e.parent;a(e)&&e.selector.trim()&&a(p)&&p.selector.trim()?r(e,p,c):l(e)&&a(p)&&p.selector.trim()&&function(e){return s.includes(e.name)}(e)?function(e,r,s,c){if(o(r),n(e,r),e.nodes){const n=r.clone().removeAll().append(e.nodes);e.append(n),t(r),c(n,s)}}(e,p,c,u):l(e)&&l(p)&&function(e,t){return s.includes(e.name)&&e.name===t.name}(e,p)&&i(e,p),"nodes"in e&&e.nodes.length&&u(e,c)}))}const p=()=>({postcssPlugin:"postcss-nesting",Rule(t,{result:n}){u(t,n),t.selector.trim().includes("&")&&function(t,n){let o,r=t.parent;for(;r;){if("rule"===r.type)return;r=r.parent}try{o=e().astSync(t.selector)}catch(e){return void t.warn(n,`Failed to parse selector : "${t.selector}" with message: "${e.message}"`)}o&&(o.walkNesting((t=>{var n,o;"root"===(null==(n=t.parent)||null==(o=n.parent)?void 0:o.type)?t.replaceWith(e.pseudo({value:":scope"})):t.replaceWith(e.pseudo({value:":is",nodes:[e.pseudo({value:":root"}),e.pseudo({value:":host"})]}))})),t.selector=o.toString())}(t,n)}});p.postcss=!0;export{p as default};
