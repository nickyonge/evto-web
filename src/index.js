
window.addEventListener('load', function () {
    console.log("page loaded");
    
    var label = this.document.createElement("Label");
    label.setAttribute("style", "font-weight:normal");
    label.innerHTML = "Hello world?";
    document.body.appendChild(label);
    
});

console.log("test!");