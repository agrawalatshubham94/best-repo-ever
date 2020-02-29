({
    init : function(component, event, helper) {
        var columns = component.get('v.columns');
        var columnHeaders = component.get('v.columnHeaders');
        for(var i=0; i<columns; i++) {
            if($A.util.isEmpty(columnHeaders[i])) {
                helper.renderHeaderInputs(component, "Table Column Header " + (i+1), '');
            } else {
                helper.renderHeaderInputs(component, "Table Column Header " + (i+1), columnHeaders[i]);
            }            
        }    
    },
    
    handleOnNext : function(component, event, helper) {
        helper.setColumnHeaders(component, event, helper);
        var valid = helper.validateComponent(component, event, helper);
        if(valid) {
            component.set('v.message', '');
            helper.navigateFlow(component, event, 'NEXT');
        }
        else {
            //Show error message
            component.set('v.message', 'Please input all the required column headers.');
        }             
    },
    
    handleOnBack : function(component, event, helper) {
        helper.setColumnHeaders(component, event, helper);
        helper.navigateFlow(component, event, 'BACK');
    }
})