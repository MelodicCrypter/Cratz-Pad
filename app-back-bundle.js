!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=5)}([function(e,t){e.exports=require("path")},function(e,t){e.exports=require("express")},function(e,t,n){"use strict";var r=n(3),o=n.n(r),i=n(1).Router();i.get("/",o.a.renderHome),t.a=i},function(e,t,n){var r=n(0);e.exports={renderHome:function(e,t){t.render("index",{locals:{pageTitle:"Cratz Pad | Write All You Want",title:"Cratz Pad"},partials:{header:r.resolve("views/partials/header.html"),footer:r.resolve("views/partials/footer.html")}})}}},function(e,t,n){"use strict";var r=n(9),o=n(10);t.a=function(e){return r.logger({transports:[new o.transports.File({name:e,filename:e,level:"info",maxsize:5242880,maxFiles:10,json:!0,colorize:!0}),new o.transports.File({name:e,filename:e,level:"debug",maxsize:5242880,maxFiles:10,json:!0,colorize:!0})]})}},function(e,t,n){e.exports=n(6)},function(e,t,n){"use strict";n.r(t),function(e){n(7);var t=n(2),r=n(4),o=n(1),i=n(0),s=n(11),u=n(12),l=n(13),a=n(14),c=o(),f=process.env.PORT,p=i.join(e,"./public/dist/"),d=i.join(e,"./log/");c.engine("html",a),c.set("views","views"),c.set("view engine","html"),c.use(u({origin:!1})),c.use(s()),c.use(o.json({limit:"300kb"})),c.use(o.urlencoded()),c.use(l()),c.use(o.static(p)),c.use(Object(r.a)("".concat(d,"/app-logs.json"))),c.use("/",t.a),c.listen(f,function(){console.log("App is listening on port ".concat(f))})}.call(this,"")},function(e,t,n){var r=n(8).env(!0);e.exports={config:r}},function(e,t){e.exports=require("custom-env")},function(e,t){e.exports=require("express-winston")},function(e,t){e.exports=require("winston")},function(e,t){e.exports=require("helmet")},function(e,t){e.exports=require("cors")},function(e,t){e.exports=require("hpp")},function(e,t){e.exports=require("express-es6-template-engine")}]);