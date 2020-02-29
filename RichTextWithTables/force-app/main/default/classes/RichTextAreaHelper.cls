/**
Apex Class Name    : RichTextAreaHelper
Version            : 1.0 
Created Date       : 17 DEC 2019
Function           : Helper class to provide picklist options on App Builder.
Modification Log   :
-----------------------------------------------------------------------------
* Developer                   Date                   Description
* ----------------------------------------------------------------------------                 
* Shubham Agrawal             17/12/2019             Original Version
**/
global class RichTextAreaHelper extends VisualEditor.DynamicPickList{
	VisualEditor.DesignTimePageContext context;
    
    global RichTextAreaHelper(VisualEditor.DesignTimePageContext context) {        
        this.context = context;
    }
    
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('NoFieldAvailable', 'No Field Available');
        return defaultValue;
    }
    
    // Method to return field mapping options as picklist while adding the EK_TextAreaComponent on the app builder
    global override VisualEditor.DynamicPickListRows getValues() {  
        VisualEditor.DynamicPickListRows values = new VisualEditor.DynamicPickListRows();
        
        String objectName = context.entityName;
        List<String> apiNames = getSupportedFields(objectName);
        for(String fieldApi : apiNames) {
            VisualEditor.DataRow value = new VisualEditor.DataRow(fieldApi, fieldApi);
            values.addRow(value);
        }
        
        return values;
    }
    
    // Method to check which fields are compatible with Rich text area.
    public static List<String> getSupportedFields(String objectName) {
        List<String> apiNames = new List<String>();
        
        Schema.DescribeSObjectResult obj = Schema.getGlobalDescribe().get(objectName).getDescribe();
        Map<String, Schema.SObjectField> fields = obj.fields.getMap();
        for(Schema.SObjectField field : fields.values()) {
            Schema.DescribeFieldResult fieldDesc = field.getDescribe();
            
            // check if field type is Text Area(Long)
            if (fieldDesc.getType() == Schema.DisplayType.TEXTAREA &&
                fieldDesc.getLength() >= 256 					   && 
                fieldDesc.getLength() <= 131072 				   &&
                !fieldDesc.isHtmlFormatted()) {
                    apiNames.add(fieldDesc.getName());                                        
                }            
        }
        
        return apiNames;
    }
}