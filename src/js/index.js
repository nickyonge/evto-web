import(/* webpackPreload: true */ './../css/fonts.css');
import(/* webpackPreload: true */ './../css/style.css');

window.addEventListener('load', function () {
    console.log("page loaded");
    
    var label = this.document.createElement("Label");
    label.setAttribute("style", "font-weight:normal");
    label.innerHTML = "Hello world? 124-08120598012958019825 Oops! H IiLl1!";
    document.body.appendChild(label);
    
});
