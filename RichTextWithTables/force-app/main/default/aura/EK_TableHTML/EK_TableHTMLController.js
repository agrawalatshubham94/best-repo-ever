({
	init : function(component, event, helper) {
        var columnHeaders = component.get('v.columnHeaders');
        component.set('v.tableHtml','');
        var tableIn = '<table role="table">';
        var tableOut = '</table>';
        var headIn = '<thead role="rowgroup">';
        var headOut = '</thead>';
        var bodyIn = '<tbody role="rowgroup">';
        var bodyOut = '</tbody>';
        var rowIn = '<tr role="row">';
        var rowOut = '</tr>';
        var rows = component.get('v.rows');
        var columns = component.get('v.columns');
        
        var htmlHeaderCode = headIn + rowIn;
        for(var j=0; j<columns; j++) {
            htmlHeaderCode += '<th role="columnheader">' + columnHeaders[j] + '</th>';
        }
        htmlHeaderCode += rowOut + headOut;
        
        var htmlBodyCode = bodyIn;
        for(var i=0; i<rows-1; i++) {
            htmlBodyCode += rowIn;
            for(var j=0; j<columns; j++) {
                htmlBodyCode += '<td role="cell" data-label="' + columnHeaders[j] + '">XXXXXX</td>';
            }
            htmlBodyCode += rowOut;
        }
        htmlBodyCode += bodyOut;
        
        var finalHtmlCode = '<div>' + tableIn + htmlHeaderCode + htmlBodyCode + tableOut + '</div>';
        component.set('v.tableHtml',finalHtmlCode);
	},
    
    handleModalClose : function(component, event, helper) {
        var navigate = component.get('v.navigateFlow');        
        component.find("overlayLib").notifyClose();        
        //navigate('FINISH');              
    },
    
    handleOnTableAdd : function(component, event, helper) {
        var tableHtml = component.get('v.tableHtml');
        var appEvent = $A.get("e.c:EK_TableHTMLEvent");
        appEvent.setParams({
            "tableHtml" : tableHtml
        });
        appEvent.fire();
    },
    
    handleOnBack : function(component, event, helper) {
        var navigate = component.get('v.navigateFlow');
        navigate('BACK');
    },
    
    handleOnCopy : function(component, event, helper) {
        var copyText = component.find("table-html").getElement();
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.execCommand("paste");
    }
})