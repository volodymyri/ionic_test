Ext.define('criterion.controller.mixin.goal.Import', function() {

    const API = criterion.consts.Api.API;

    return {

        mixinId : 'goal_import',

        getImportGoalParams() {
            return '_rnd=' + (+(new Date()));
        },

        handleImportGoals() {
            let me = this,
                importDialog,
                params = me.getImportGoalParams(),
                extraFields = [];

            extraFields.unshift({
                xtype : 'button',
                glyph : criterion.consts.Glyph['ios7-download-outline'],
                cls : 'criterion-btn-primary',
                width : 60,
                margin : '0 0 0 10',
                listeners : {
                    click : () => {
                        window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(
                            "{0}?{1}",
                            API.EMPLOYEE_GOAL_IMPORT_DOWNLOAD_TEMPLATE,
                            params
                        )));
                    }
                }
            });

            importDialog = Ext.create('criterion.view.common.FileAttachForm', {
                title : i18n.gettext('Import Goals'),
                attachButtonText : i18n.gettext('Import'),
                modal : true,
                uploadUrl : Ext.String.format('{0}?{1}', API.EMPLOYEE_GOAL_IMPORT_UPLOAD, params),
                maxFileSizeUrl : API.EMPLOYEE_GOAL_IMPORT_MAXFILESIZE,
                fileFieldName : 'goalFile',
                extraFields : extraFields,
                layout : 'hbox',
                callback : {
                    scope : me,
                    fn : me.load
                },
                success : {
                    scope : me,
                    fn : me.doImportGoals
                }
            });

            importDialog.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            importDialog.show();

            me.setCorrectMaskZIndex(true);
        },

        doImportGoals(result) {
            let me = this;

            if (result['hasErrors']) {
                criterion.Msg.confirm(
                    i18n.gettext('Import Goals'),
                    i18n.gettext('The file has been validated and errors were found. Would you like to look through them?'),
                    btn => {
                        if (btn === 'yes') {
                            window.open(
                                criterion.Api.getSecureResourceUrl(
                                    Ext.String.format(
                                        API.EMPLOYEE_GOAL_IMPORT_ERRORS,
                                        result['fileId']
                                    )
                                ), '_blank'
                            );
                        } else {
                            me.deleteImportFile(result.fileId);
                        }
                    }
                );
            } else {
                criterion.Msg.confirm(
                    i18n.gettext('Import Goals'),
                    i18n.gettext('The file has been validated and no errors were found. Would you like to import the file?'),
                    btn => {
                        if (btn === 'yes') {
                            criterion.Api.request({
                                url : Ext.String.format(API.EMPLOYEE_GOAL_IMPORT, result['fileId']) + '?' + me.getImportGoalParams(),
                                method : 'PUT',
                                callback : function() {
                                    criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                                    me.load();
                                }
                            });
                        } else {
                            me.deleteImportFile(result['fileId']);
                        }
                    }
                );
            }
        },

        deleteImportFile(fileId) {
            criterion.Api.request({
                url : Ext.String.format(API.EMPLOYEE_GOAL_IMPORT, fileId),
                method : 'DELETE',
                scope : this
            });
        }
    }
});
