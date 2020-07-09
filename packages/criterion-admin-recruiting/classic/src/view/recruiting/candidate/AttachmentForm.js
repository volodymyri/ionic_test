Ext.define('criterion.view.recruiting.candidate.AttachmentForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_attachment_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.recruiting.candidate.AttachmentForm'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_attachment_form'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : 350,
                height : 'auto'
            }
        ],

        draggable : true,

        title : i18n.gettext('Add Attachment'),

        closable : false,

        setButtonConfig : function() {
            let buttons = [];

            buttons.push(
                {
                    xtype : 'button',
                    cls : 'criterion-btn-light',
                    scale : 'small',
                    text : i18n.gettext('Cancel'),
                    handler : 'handleCancelClick'
                },
                {
                    xtype : 'button',
                    scale : 'small',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Add'),
                    handler : 'handleAttach'
                }
            );

            this.buttons = buttons;
        },

        items : [
            {
                xtype : 'criterion_filefield',
                fieldLabel : i18n.gettext('File Name'),
                name : 'attachment',
                reference : 'attachment',
                allowBlank : false,
                maxFileSizeUrl : criterion.consts.Api.API.CANDIDATE_ATTACHMENT_MAX_FILE_SIZE, // result will be returned in bytes!
                listeners : {
                    fileChange : 'handleFileChange'
                }
            },
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Document Type'),
                codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE,
                name : 'documentTypeCd',
                reference : 'documentTypeCd',
                allowBlank : false,
                forceSelection : false,
                editable : false,
                listeners : {
                    codedetailsLoaded : function() {
                        let store = this.getStore();

                        store.clearFilter();

                        store.filterBy(function(record) {
                            let attribute1Value = record.get('attribute1'),
                                attribute2Value = record.get('attribute2');

                            return attribute1Value === '1' || attribute2Value === '1';
                        });
                    }
                }
            },
            {
                xtype : 'textfield',
                name : 'description',
                reference : 'description',
                allowBlank : false,
                fieldLabel : i18n.gettext('Description')
            }
        ]

    }
});
