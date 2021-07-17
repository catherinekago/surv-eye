export const click = (elementID) => {


    let element = document.getElementById(elementID);
    console.log(elementID);
    let x = element.getBoundingClientRect().left + element.getBoundingClientRect().width * 0.5;
    let y = element.getBoundingClientRect().top + element.getBoundingClientRect().width * 0.5;
    console.log(x + ", " + y);

    var ev = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'screenX': x,
            'screenY': y,
            'clientX': x,
            'clientY': y
        });
    
        var el = document.elementFromPoint(x, y);
        el.dispatchEvent(ev);
        console.log("clicked!");


  return;
}
