Ext.define('criterion.controller.settings.system.dataImport.Employers', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_employers',

        requires : [
            'criterion.view.common.geocode.ValidationEmployer'
        ],

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Employers Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.EMPLOYERS_IMPORT,
                    data : {
                        employersFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.EMPLOYERS_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.EMPLOYERS_IMPORT_UPDATE,
                    orderedParams : [
                        this.getSelectedEmployerId()
                    ]
                }
            });
        },

        afterImport() {
            let win = Ext.create('criterion.view.common.geocode.ValidationEmployer', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : '90%',
                        width : '90%'
                    }
                ],

                listeners : {
                    scope : 'controller',
                    show : () => {
                        win.load();
                    }
                },

                title : i18n.gettext('Geocode Validation'),

                buttons : [
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        scale : 'small',
                        text : i18n.gettext('Cancel'),
                        handler : () => {
                            win.destroy();
                        }
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Update'),
                        handler : () => {
                            win.handleUpdate().then(_ => {
                                criterion.Utils.toast(i18n.gettext('Successfully fixed.'));
                                win.destroy();
                            })
                        }
                    }
                ]
            });

            win.show();
        }
    }
});
