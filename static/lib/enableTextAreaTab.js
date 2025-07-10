(function(g,f){if(typeof define=="function"&&define.amd){define(f)}else if(typeof exports=="object" && typeof module<"u"){module.exports=f()}else{var m=f();for(var i in m) g[i]=m[i]}}(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this,function(){var exports={};var __exports=exports;var module={exports};

// ts/enableTextAreaTab.ts
function enableTab(ev) {
  if (ev.key == "Tab") {
    ev.preventDefault();
    const val = this.value;
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = val.substring(0, start) + "	" + val.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;
  }
}
(function() {
  for (let textarea of document.querySelectorAll("textarea")) {
    textarea.addEventListener("keydown", enableTab);
  }
})();

if(__exports != exports)module.exports = exports;return module.exports}));
