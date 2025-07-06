function enableTab(this: HTMLTextAreaElement, ev: KeyboardEvent) {
  if (ev.key == "Tab") {
    ev.preventDefault();
    const val = this.value;
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = val.substring(0, start) + "\t" + val.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;
  }
}

(function () {
  for (let textarea of document.querySelectorAll("textarea")) {
    textarea.addEventListener("keydown", enableTab);
  }
})();
