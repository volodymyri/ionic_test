Ext.define('criterion.view.settings.benefits.openEnrollment.Announcements', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment_announcements',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.benefits.openEnrollment.Announcements',
            'criterion.view.settings.benefits.openEnrollment.AnnouncementForm',
            'criterion.store.employer.openEnrollment.Announcements'
        ],

        viewModel : {
            stores : {
                announcementsStore : {
                    type : 'criterion_employer_open_enrollment_announcements'
                }
            }
        },

        controller : {
            type : 'criterion_settings_open_enrollment_announcements',
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_settings_open_enrollment_announcement_form',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{announcementsStore}'
        },

        minButtonWidth : 100,

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add Announcement'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ],

        buttons : [
            {
                xtype : 'button',
                listeners : {
                    click : 'handlePrevClick'
                },
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Previous')
            },
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',
                listeners : {
                    click : 'handleNextClick'
                },
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Next')
            }
        ],

        columns : [
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Announcement Date'),
                dataIndex : 'announcementDate',
                width : 200
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Announcement'),
                dataIndex : 'announcement',
                flex : 1,
                renderer : criterion.Utils.decodeHtmlEntities
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };

});
