Ext.define('criterion.controller.recruiting.jobs.JobList', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_recruiting_job_list',

        requires : [
            'criterion.view.common.FileAttachForm'
        ],

        mixins : [
            'criterion.controller.mixin.SingleEmployer',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        load(opts) {
            let me = this;

            Ext.promise.Promise.all([
                criterion.CodeDataManager.load([criterion.consts.Dict.DEPARTMENT]),
                me.getStore('employerWorkLocations').loadWithPromise()
            ]).then({
                scope : this,
                success : () => {
                    me.getView().getStore().load(Ext.apply({}, opts));
                }
            })
        },

        search(searchCriteria) {
            let view = this.getView(),
                jobsStore = view.getStore();

            jobsStore.getProxy().setExtraParams(searchCriteria);
            jobsStore.loadPage(1);
        },

        handleEditAction(record) {
            this.getView().fireEvent('select', record)
        },

        handleImportClick() {
            let me = this,
                importDialog,
                extraFields = [
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        cls : 'criterion-btn-primary',
                        width : 60,
                        margin : '0 0 0 10',
                        listeners : {
                            click : () => {
                                window.open(criterion.Api.getSecureResourceUrl(API.JOB_POSTINGS_IMPORT_DOWNLOAD_TEMPLATE));
                            }
                        }
                    }
                ];

            importDialog = Ext.create('criterion.view.common.FileAttachForm', {
                title : i18n.gettext('Import Jobs'),
                attachButtonText : i18n.gettext('Import'),
                modal : true,
                uploadUrl : API.JOB_POSTINGS_IMPORT_UPLOAD,
                maxFileSizeUrl : API.JOB_POSTINGS_IMPORT_MAX_FILE_SIZE,
                fileFieldName : 'jobPostingsFile',
                extraFields : extraFields,
                layout : 'hbox',
                success : {
                    scope : me,
                    fn : me.importJobs
                }
            });

            importDialog.on({
                close : () => {
                    me.setCorrectMaskZIndex(false);
                }
            });

            importDialog.show();

            me.setCorrectMaskZIndex(true);
        },

        importJobs(result) {
            let me = this;

            if (result.hasErrors) {
                criterion.Msg.confirm(
                    i18n.gettext('Import Jobs'),
                    i18n.gettext('The file has been validated and errors were found. Would you like to look through them?'),
                    (btn) => {
                        if (btn === 'yes') {
                            window.open(
                                criterion.Api.getSecureResourceUrl(
                                    Ext.String.format(
                                        API.JOB_POSTINGS_IMPORT_ERRORS,
                                        result.fileId
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
                    i18n.gettext('Import Jobs'),
                    i18n.gettext('The file has been validated and no errors were found. Would you like to import the file?'),
                    (btn) => {
                        if (btn === 'yes') {
                            criterion.Api.request({
                                url : Ext.String.format(API.JOB_POSTINGS_IMPORT_PROCESS, result.fileId),
                                method : 'PUT',
                                callback : () => {
                                    criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                                    me.load();
                                }
                            });
                        } else {
                            me.deleteImportFile(result.fileId);
                        }
                    }
                );
            }
        },

        deleteImportFile(fileId) {
            criterion.Api.request({
                url : Ext.String.format(API.JOB_POSTINGS_IMPORT_PROCESS, fileId),
                method : 'DELETE',
                scope : this
            });
        }
    };
});