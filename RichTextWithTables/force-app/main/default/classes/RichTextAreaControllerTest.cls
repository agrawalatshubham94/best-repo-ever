/**
Apex Class Name    : RichTextAreaControllerTest
Version            : 1.0 
Created Date       : 17 DEC 2019
Function           : Test class for EK_RichTextAreaController class
Modification Log   :
-----------------------------------------------------------------------------
* Developer                   Date                   Description
* ----------------------------------------------------------------------------                 
* Shubham Agrawal             17/12/2019             Original Version
**/
@isTest
public class RichTextAreaControllerTest {
    
    // Test Setup method
    @testSetup
    static void RichTextAreaControllerTestSetup() {
        Table_Content__c contentRec = new Table_Content__c(Name = 'Rich content with table');
        insert contentRec;        
    }
    
    // Test method for getRichText()
    @isTest
    static void getRichTextTest() {        
        Table_Content__c expectedTableContentRec = [SELECT Id, Name, Table__c FROM Table_Content__c 
                                                    WHERE Name = 'Rich content with table'];
        
        User testUser = createUser('System Administrator', 'Admin', null, 
                                   'admin@gmail.com', 'admin@gmail.com.admin');
        System.runAs(testUser) {
            Test.startTest();
            Table_Content__c actualTableContentRec = (Table_Content__c)RichTextAreaController.getRichText('Table_Content__c', 
                                                                                                          'Table__c', 
                                                                                                          expectedTableContentRec.Id);            
            Test.stopTest(); 
            System.assertEquals(actualTableContentRec.Table__c,expectedTableContentRec.Table__c);
        }              
    }
    
    // Test method for saveRichText()
    @isTest
    static void saveRichTextTest() { 
        Table_Content__c expectedTableContentRec = [SELECT Id, Name, Table__c FROM Table_Content__c 
                                                    WHERE Name = 'Rich content with table'];
        
        User testUser = createUser('System Administrator', 'Admin', null, 
                                   'admin@gmail.com', 'admin@gmail.com.admin');
        System.runAs(testUser) {
            Test.startTest();
            String actualContent = RichTextAreaController.saveRichText('<p>This is the test rich content updated</p>', 
                                                                          'Table_Content__c', 
                                                                          'Table__c', 
                                                                          expectedTableContentRec.Id);
            String expectedContent = ((Table_Content__c)RichTextAreaController.getRichText('Table_Content__c', 
                                                                                           'Table__c', 
                                                                                           expectedTableContentRec.Id)).Table__c; 
            Test.stopTest(); 
            System.assertEquals(actualContent, expectedContent);
        }              
    }
    
    // Test method for richTextHelperTest()
    @isTest
    static void richTextHelperTest() {
        VisualEditor.DesignTimePageContext context = new VisualEditor.DesignTimePageContext();
        context.entityName = 'Table_Content__c';
        context.pageType = 'RecordPage';    
        
        User testUser = createUser('System Administrator', 'Admin', null, 
                                   'admin@gmail.com', 'admin@gmail.com.admin');
        
        System.runAs(testUser) {
            Test.startTest();
            RichTextAreaHelper helperObj = new RichTextAreaHelper(context);
            VisualEditor.DynamicPickListRows rows = helperObj.getValues();
            Test.stopTest();
        }        
    }
    
    //Create an user test data with a particular profile name.
    public static User createUser(String profileName, String lastName, String role, 
                                  String email, String userName){
        Profile prf = [SELECT Id FROM Profile WHERE Name = :profileName];
        User usr = new User(UserName = userName, 
                            Lastname = lastName, 
                            FirstName = 'Test', 
                            Email = email, 
                            ProfileId = prf.Id, 
                            Alias = 'test', 
                            TimeZoneSidKey = 'GMT', 
                            LanguageLocaleKey = 'en_US', 
                            EmailEncodingKey = 'UTF-8', 
                            LocaleSidKey = 'en_US' );
        return usr;
    }
}