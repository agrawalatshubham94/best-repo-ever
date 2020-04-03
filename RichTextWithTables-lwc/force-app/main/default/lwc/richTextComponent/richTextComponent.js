/* eslint-disable @lwc/lwc/no-inner-html */
/* eslint-disable no-console */
import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import { simplifyRichContent } from 'c/richTextHelper';
 
export default class RichTextComponent extends LightningElement {
    @api objectApiName;
    @api fieldApi;
    @api recordId;
    @track formats = ['bold', 'italic', 'underline','list', 'indent', 'align', 'link','clean', 'table', 'header'];
    fieldInfo;
    fieldLabel;
    objectInfo;    
    isEditMode = false;
    content;
    originalContent;
    updatedContent;
    showModal = false;
    isDisabled = true;
    
    handleError(error) {
        let message = 'Unknown error';
        if (Array.isArray(error.body)) {
            message = error.body.map(e => e.message).join(', ');
        } else if (typeof error.body.message === 'string') {
            message = error.body.message;
        }
        // eslint-disable-next-line no-console
        console.error(message);
    }

    @wire(getObjectInfo, { objectApiName: '$objectApiName' }) 
    getObjectInfo({error, data}) {
        if(error) {
            this.handleError(error);
        }else if(data) {
            this.objectInfo = data;
            this.fieldLabel = data.fields[this.fieldApi].label;
            this.fieldInfo = this.objectApiName + '.' + this.fieldApi;  
        }
    }
    
    @wire(getRecord, { recordId: '$recordId', fields: '$fieldInfo'})
    wiredRecord({error, data}) {
        if(error) {
            this.handleError(error);
        } else if(data) {
            //this.content = data.fields[this.fieldApi].value;
            this.originalContent = data.fields[this.fieldApi].value;
        }
    }

    handleContentChange(event) {
        //this.content = event.target.value;
        this.updatedContent = event.target.value;
    }

    handleOnSave() {
        this.isDisabled = true;
        this.updatedContent = simplifyRichContent(this.updatedContent);        

        // Create the recordInput object
        const fields = {};
        fields.Id = this.recordId;
        fields[this.fieldApi] = this.updatedContent;

        const recordInput = { fields };
        
        updateRecord(recordInput)
        .then(() => {
            this.originalContent = this.updatedContent;
            this.isEditMode = false;
        })
        .catch(error => {
            this.handleError(error);
        })
    }

    handleOnCancel(){
        this.isEditMode = false;
    }

    handleEdit() {
        this.updatedContent = this.originalContent;
        this.isEditMode = true;
        this.isDisabled = false;
    }

    handleInfoPop() {
        this.showModal = true;
        document.body.style.overflow = "hidden";
    }

    handleCloseModal() {
        this.showModal = false;
        document.body.style.overflow = "auto";
    }
}