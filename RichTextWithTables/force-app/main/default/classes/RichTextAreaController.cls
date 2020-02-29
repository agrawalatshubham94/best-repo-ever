/**
Apex Class Name    : EK_RichTextAreaController
Version            : 1.0 
Created Date       : 17 DEC 2019
Function           : Class to fetch and udpate the rich text content
Modification Log   :
-----------------------------------------------------------------------------
* Developer                   Date                   Description
* ----------------------------------------------------------------------------                 
* Shubham Agrawal             17/12/2019             Original Version
**/
public with sharing class RichTextAreaController {
    /*
     * Save rich text content on a record.
     * @param content : rich content to be set
     * @param objectAPIName : Object API name where content to be saved
     * @param fieldAPIName : field API name where content to be saved
     * @param recordId : record which needs to be updated
     * @return String : HTML decoded content 
     */
    @AuraEnabled
    public static String saveRichText(String content, String objectAPIName, String fieldAPIName, String recordId) { 
        String decodedContent = '';
            
        if(String.isBlank(objectAPIName) || String.isBlank(fieldAPIName) || String.isBlank(recordId) || content == null) return decodedContent;
                
        decodedContent = content.unescapeHtml4();
        
        sObject sObj = Schema.getGlobalDescribe().get(objectAPIName).newSObject();
        sObj.put(fieldAPIName, decodedContent);
        sObj.put('Id', recordId);
        Database.SaveResult saveRes = Database.update(sObj,false);       
        
        if(!saveRes.isSuccess()) {
            String errorMsg = '';
            for(Database.Error err : saveRes.getErrors()) {
                errorMsg += err.getStatusCode() + ':' + err.getMessage();
            }
            throw new AuraHandledException(errorMsg);
        }
        
        return decodedContent;
    }
    
    /*
     * Gets rich text content from the record
     * @param objectAPIName : Object API name where content to be saved
     * @param fieldAPIName : field API name where content to be saved
     * @param recordId : record which needs to be updated
     * @return sObject : Object record havin content 
     */
    @AuraEnabled
    public static sObject getRichText(String objectAPIName, String fieldAPIName, String recordId) {
        
        if(String.isBlank(objectAPIName) || String.isBlank(fieldAPIName) || String.isBlank(recordId)) return null;
        
        String query = 'SELECT ' + fieldAPIName + ' FROM ' + objectAPIName + ' WHERE Id = ' + '\'' + recordId + '\'' + ' LIMIT 1';
        
        sObject obj = Database.query(query);
        
        return obj;
    }
}
