!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=5)}([function(e,n){e.exports=require("path")},function(e,n){e.exports=require("express")},function(e,n,t){"use strict";var r=t(3),o=t.n(r),i=t(1).Router();i.get("/",o.a.renderHome),n.a=i},function(e,n,t){(function(n){var r,o,i,s,u=t(0),c=t(9),l=t(10);c.getMac(function(e,n){e&&(r="GodIsGood777"),r=n}),l.file(/(?:^|\W)app(?:$|\W)/,u.join(n,"../../public/dist/"),function(e){o=e[0].replace("public/dist/","")}).error(function(e){}),l.file(/(?:^|\W)runtime(?:$|\W)/,u.join(n,"../../public/dist/"),function(e){s=e[0].replace("public/dist/","")}).error(function(e){}),l.file(/(?:^|\W)vendors(?:$|\W)/,u.join(n,"../../public/dist/"),function(e){i=e[0].replace("public/dist/","")}).error(function(e){});e.exports={renderHome:function(e,n){n.render("index",{locals:{pageTitle:"Cratz Pad | Write All You Want",title:"Cratz Pad",vital:r.toString(),appJS:o,runtimeJS:s,vendorsJS:i},partials:{header:u.resolve("views/partials/header.html"),footer:u.resolve("views/partials/footer.html")}})}}}).call(this,"controllers/pages")},function(e,n,t){"use strict";var r=t(11),o=t(12);n.a=function(e){return r.logger({transports:[new o.transports.File({name:e,filename:e,level:"info",maxsize:5242880,maxFiles:10,json:!0,colorize:!0}),new o.transports.File({name:e,filename:e,level:"debug",maxsize:5242880,maxFiles:10,json:!0,colorize:!0})]})}},function(e,n,t){e.exports=t(6)},function(e,n,t){"use strict";t.r(n),function(e){t(7);var n=t(2),r=t(4),o=t(1),i=t(0),s=t(13),u=t(14),c=t(15),l=t(16),a=o(),p=process.env.PORT,f=i.join(e,"./public/dist/"),d=i.join(e,"./log/");a.engine("html",l),a.set("views","views"),a.set("view engine","html"),a.use(u({origin:!1})),a.use(s()),a.use(o.json({limit:"300kb"})),a.use(o.urlencoded()),a.use(c()),a.use(o.static(f,{etag:!0,lastModified:!0,setHeaders:function(e,n){e.setHeader("Cache-Control","max-age=31536000")}})),a.use(Object(r.a)("".concat(d,"/app-logs.json"))),a.use("/",n.a),a.listen(p,function(){console.log("App is listening on port ".concat(p)),process.send&&process.send("online")})}.call(this,"")},function(e,n,t){var r=t(8).env(!0);e.exports={config:r}},function(e,n){e.exports=require("custom-env")},function(e,n){e.exports=require("getmac")},function(e,n){e.exports=require("find")},function(e,n){e.exports=require("express-winston")},function(e,n){e.exports=require("winston")},function(e,n){e.exports=require("helmet")},function(e,n){e.exports=require("cors")},function(e,n){e.exports=require("hpp")},function(e,n){e.exports=require("express-es6-template-engine")}]);