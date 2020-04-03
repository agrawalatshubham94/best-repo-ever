/* eslint-disable @lwc/lwc/no-inner-html */
/* eslint-disable no-console */
export function simplifyRichContent(htmlString) {
    htmlString = removeInlineStyle(htmlString);
    htmlString = removeUnwantedTags(htmlString);
    htmlString = appendTableHead(htmlString);
    htmlString = appendDataLabel(htmlString);
    return htmlString;
}

function removeInlineStyle(htmlString) {
    let txt = document.createElement('div');
    txt.innerHTML = htmlString;
    txt.querySelectorAll('[style]').forEach(el => {
        el.removeAttribute("style");
    });
    txt.querySelectorAll('[width]').forEach(el => {
        el.removeAttribute("width");
    });
    txt.querySelectorAll('[height]').forEach(el => {
        el.removeAttribute("height");
    });
    /*txt.querySelectorAll('[class]').forEach(el => {
        el.removeAttribute("class");
    });*/
    //console.log('-->',txt.outerHTML);
    return txt.outerHTML;
}

function removeUnwantedTags(htmlString) {
    let txt = document.createElement('div');
    txt.innerHTML = htmlString;
    txt.querySelectorAll('colgroup').forEach(el => {
        el.remove();        
    });
    //console.log('removed colgroup-->',txt.innerHTML);
    return txt.innerHTML;
}

function appendTableHead(htmlString) {
    let txt = document.createElement('div');
    txt.innerHTML = htmlString;
    txt.querySelectorAll('table').forEach(table => {
        table.style.width = "100%";
        if (table.firstChild.tagName !== 'THEAD') {        
            let head = table.createTHead();
            head.style.border = "1px solid";
            let row = head.insertRow(0);
            for(let i=0; i<table.rows[1].cells.length; i++) {
                let headCell = document.createElement("TH");
                headCell.innerHTML = table.rows[1].cells[i].innerText;
                row.appendChild(headCell);
            }
            table.rows[1].remove();
        }
    });
    //console.log('added header-->',txt.innerHTML);
    return txt.innerHTML;
}

function appendDataLabel(htmlString) {
    let txt = document.createElement('div');
    txt.innerHTML = htmlString;
    txt.querySelectorAll('table').forEach(table => {
        table.tHead.style.border = "1px solid";
        for (let i = 1; i<table.rows.length; i++) {
            table.rows[i].style.border = "1px solid";
            for (let j = 0; j<table.rows[i].cells.length; j++) {
                table.rows[i].cells[j].setAttribute('data-label',table.rows[0].cells[j].innerText);
            }
        }
    });
    //console.log('added data label -->',txt.innerHTML);
    return txt.innerHTML;
}