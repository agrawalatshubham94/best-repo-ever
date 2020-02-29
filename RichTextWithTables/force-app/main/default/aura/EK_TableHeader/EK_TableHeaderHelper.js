({
    renderHeaderInputs : function(component, label, value) {        
        $A.createComponent(
            "lightning:input",
            {
                "aura:id": "input",
                "label": label,
                "value": value
            },
            function(newButton, status, errorMessage){
                if (status === "SUCCESS") {
                    var body = component.get("v.body");
                    body.push(newButton);
                    component.set("v.body", body);
                }
            }
        );        
    },
    
    setColumnHeaders : function(component, event, helper) {
        var headers = component.find("input");
        var columnHeaders = component.get('v.columnHeaders');
        columnHeaders = [];
        if($A.util.isArray(headers)) {
            for(var i=0; i<headers.length; i++) { 
                columnHeaders.push(headers[i].get('v.value'));
            }  
        } else {
            columnHeaders.push(headers.get('v.value'));
        }
        component.set('v.columnHeaders',columnHeaders);
    },
    
    validateComponent : function(component, event, helper) {        
        var headers = component.find("input");
        if($A.util.isArray(headers)) {
            for(var i=0; i<headers.length; i++) { 
                if($A.util.isEmpty(headers[i].get('v.value'))) return false;
            }
        } else {
            if($A.util.isEmpty(headers.get('v.value'))) return false;
        }
        return true;
    },
    
    navigateFlow : function(component, event, actionType) {
        var navigate = component.get('v.navigateFlow');
        navigate(actionType);
    }
})