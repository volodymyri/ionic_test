Ext.define('criterion.view.recruiting.candidate.UploadFileForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_upload_file_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.UploadFileForm'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_upload_file_form'
        },

        config : {
            candidateId : null,
            documentTypeCd : null,
            fileDescription : null,
            fieldTitle : i18n.gettext('File Name')
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

        title : i18n.gettext('Upload file'),

        closable : false,

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Save'),
                handler : 'handleAttach'
            }
        ],

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_filefield',
                    fieldLabel : this.config.fieldTitle,
                    name : 'attachment',
                    reference : 'attachment',
                    maxFileSizeUrl : criterion.consts.Api.API.CANDIDATE_ATTACHMENT_MAX_FILE_SIZE, // result will be returned in bytes!
                    listeners : {
                        fileChange : 'handleFileChange'
                    }
                }
            ];

            this.callParent(arguments);
        }
    };
});
