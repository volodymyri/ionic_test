Ext.define('criterion.view.recruiting.candidate.UploadResumeForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_upload_resume_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.UploadResumeForm'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_upload_resume_form'
        },

        config : {
            candidateId : null
        },

        viewModel : {
            data : {
                isFileSelected : false
            }
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

        title : i18n.gettext('Resume'),

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
                handler : 'handleAttach',
                disabled : true,
                bind : {
                    disabled : '{!isFileSelected}'
                }
            }
        ],

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_filefield',
                    fieldLabel : i18n.gettext('Resume'),
                    name : 'resume',
                    reference : 'fileSelector',
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
