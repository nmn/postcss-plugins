import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as e,cloneTokens as r}from"@csstools/css-tokenizer";import{color as t,SyntaxFlag as o,serializeRGB as a,colorDataFitsRGB_Gamut as l,serializeP3 as n}from"@csstools/css-color-parser";import{replaceComponentValues as u,parseCommaSeparatedListOfComponentValues as c,isFunctionNode as i,stringify as p}from"@csstools/css-parser-algorithms";function hasFallback(s){const e=s.parent;if(!e)return!1;const r=s.prop.toLowerCase(),t=e.index(s);for(let s=0;s<t;s++){const t=e.nodes[s];if("decl"===t.type&&t.prop.toLowerCase()===r)return!0}return!1}const f=/(rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(\s*?from/i;function hasSupportsAtRuleAncestor(s){let e=s.parent;for(;e;)if("atrule"===e.type){if("supports"===e.name.toLowerCase()&&f.test(e.params))return!0;e=e.parent}else e=e.parent;return!1}const b=/(rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(/i,h=/^(rgb|hsl|hwb|lab|lch|oklch|oklab|color)$/i,m=/from/i,basePlugin=s=>({postcssPlugin:"postcss-relative-color-syntax",Declaration:f=>{const g=f.value;if(!b.test(g))return;if(!m.test(g))return;if(hasFallback(f))return;if(hasSupportsAtRuleAncestor(f))return;const y=e({css:g}),v=u(c(y),(s=>{if(i(s)&&h.test(s.getName())){const e=t(s);if(!e)return;if(e.syntaxFlags.has(o.HasNoneKeywords))return;if(!e.syntaxFlags.has(o.RelativeColorSyntax))return;return a(e)}})),F=p(v);if(F===g)return;let d=F;null!=s&&s.subFeatures.displayP3&&(d=p(u(c(r(y)),(s=>{if(i(s)&&h.test(s.getName())){const e=t(s);if(!e)return;if(e.syntaxFlags.has(o.HasNoneKeywords))return;if(!e.syntaxFlags.has(o.RelativeColorSyntax))return;return l(e)?a(e):n(e)}})))),f.cloneBefore({value:F}),null!=s&&s.subFeatures.displayP3&&d!==F&&f.cloneBefore({value:d}),null!=s&&s.preserve||f.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return r.subFeatures=Object.assign({displayP3:!0},r.subFeatures),r.enableProgressiveCustomProperties&&(r.preserve||r.subFeatures.displayP3)?{postcssPlugin:"postcss-relative-color-syntax",plugins:[s(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
