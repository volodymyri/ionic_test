Ext.define('criterion.view.settings.benefits.openEnrollment.AnnouncementForm', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment_announcement_form',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Announcement'),

        modelValidation : false,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
            padding : '15 40 0 15'
        },

        items : [
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Announcement Date'),
                bind : '{record.announcementDate}',
                name : 'announcementDate',
                maxWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
            },
            {
                xtype : 'htmleditor',
                reference : 'description',
                enableAlignments : false,
                fieldLabel : i18n.gettext('Announcement'),
                bodyPadding : 10,
                height : 300,
                resizable : true,
                resizeHandles : 's',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HTMLEDITOR_WIDTH,
                bind : {
                    value : '{record.announcement}'
                },
                allowBlank : false
            }
        ]
    };

});
