({
    // Called to decode the text in html format
    decodeHTML : function(encodedHtml) {
        var txt = document.createElement('textarea');
        txt.innerHTML = encodedHtml;
        
        return txt.value;
    },
    
    // Called to make server side calls
    serverSideCall : function(component,action) {
        return new Promise(function(resolve, reject) { 
            action.setCallback(this,function(response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    resolve(response.getReturnValue());
                } else {
                    reject(response.getError()[0].message);
                }
            }); 
            $A.enqueueAction(action);
        });
    }
})