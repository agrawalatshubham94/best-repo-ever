({
    // Called on component initialization
    init : function(component, event, helper) { 
        console.log('caliling');
		var action = component.get('c.getRichText');
        action.setParams({
            objectAPIName : component.get('v.sObjectName'),
            fieldAPIName : component.get('v.mappedField'),
            recordId : component.get('v.recordId')
        });
        helper.serverSideCall(component,action).then(            
            function(res) {
                if(!$A.util.isEmpty(res)) {
                    var fieldName = component.get('v.mappedField');
                    const map = new Map(Object.entries(res));
                    component.set("v.contentOriginal",map.get(fieldName));
                }                
            }
        ).catch(function(error) {
            console.log('Error occurred -->',error);
        });
	},    
    
    // Called on component Save event
	handleOnSave : function(component, event, helper) {
        console.log('calling on save.');
		var str = component.get('v.contentUpdated');
        var action = component.get('c.saveRichText'); 
        action.setParams({
            content : str,
            objectAPIName : component.get('v.sObjectName'),
            fieldAPIName : component.get('v.mappedField'),
            recordId : component.get('v.recordId')
        });
        helper.serverSideCall(component,action).then(
            function(res) {
                if(!$A.util.isEmpty(res)) {
                    component.set('v.errorMsg','');
                    component.set('v.contentOriginal',res); 
                    component.set('v.isEdit',false);
                }
            }
        ).catch(function(error) {
            component.set('v.errorMsg',error);
        });       
	},
    
    // Called on component edit button press
    handleOnEdit : function(component, event, helper) {
        console.log('caliling');
        component.set('v.contentUpdated',component.get('v.contentOriginal'));
        component.set('v.isEdit',true);
    },
    
    // Called on component Calcel button press
    handleOnCancel : function(component, event, helper) {
        console.log('caliling');
        component.set('v.contentUpdated',component.get('v.contentOriginal'));
    	component.set('v.isEdit',false);
        component.set('v.errorMsg','');
    },
    
    // Called on component Add table button press. Opens up a modal window to construct table
    handleAddTable : function(component, event, helper) {
        var modalBody;
        $A.createComponent("c:EK_TableConstruct", {},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content;
                                   component.find('overlayLib').showCustomModal({
                                       body: modalBody,
                                       showCloseButton: true,
                                       cssClass: "mymodal"
                                   })
                               }
                           });
    },
    
    // Called as handler from EK_TableConstruct to update current content
    handleApplicationEvent : function(component, event, helper) {
        console.log('caliling');
        var tableHTML = event.getParam("tableHtml");
        var richContent = component.get('v.contentUpdated');
        component.set('v.contentUpdated', richContent + tableHTML);        
    },
    
    
    // Called during paste event
    handleOnPaste : function(component, event, helper) {
        /*
        console.log('caliling');
        setTimeout(function(){
            var str = component.get('v.contentUpdated');       
            component.set('v.contentUpdated',helper.decodeHTML(str)); 
        },2);        
        */
    }
})