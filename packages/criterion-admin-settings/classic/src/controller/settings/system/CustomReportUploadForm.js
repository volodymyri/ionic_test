Ext.define('criterion.controller.settings.system.CustomReportUploadForm', function() {

    var report,
        options,
        record;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_custom_reports_upload_form',

        handleSelectReportFile : function(event) {
            report = event.target && event.target.files && event.target.files[0];
        },
        handleSelectOptionsFile : function(event) {
            options = event.target && event.target.files && event.target.files[0];
        },

        handleRecordLoad : function(rec) {
            var vm = this.getViewModel();

            record = rec;

            vm.set({
                record : rec,
                isPhantom : rec.phantom
            });
        },

        handleAfterRender : function() {
            var view = this.getView(),
                reportFile = this.lookupReference('reportFile'),
                optionsFile = this.lookupReference('optionsFile'),
                reportFileEl = reportFile.getEl(),
                optionsFileEl = optionsFile.getEl();

            this.getViewModel().getStore('reportGroups').loadWithPromise().always(function() {
                view.setLoading(false);
            });

            reportFileEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    reportFileEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    report = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (reportFile && report) {
                        reportFile.inputEl.dom.value = report.name;
                    }

                    reportFileEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    reportFileEl.removeCls('drag-over');
                }
            });

            optionsFileEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    optionsFileEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    options = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (optionsFile && options) {
                        optionsFile.inputEl.dom.value = options.name;
                    }

                    optionsFileEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    optionsFileEl.removeCls('drag-over');
                }
            });
        },

        handleSave : function() {
            var me = this,
                view = this.getView(),
                reportFile = this.lookupReference('reportFile'),
                optionsFile = this.lookupReference('optionsFile'),
                reportGroupId = this.lookupReference('reportGroup').getValue(),
                reportType = this.lookupReference('reportType'),
                name = this.lookupReference('name'),
                extraData = {
                    report : report,
                    options : options
                };

            if (me.getView().getForm().isValid()) {

                if (reportGroupId) {
                    extraData.reportGroupId = reportGroupId;
                }

                if (!record.phantom) {
                    me.updateRecord(record, me.handleRecordUpdate);
                    return;
                } else {
                    // Erase record since we are sending data via submitFakeForm
                    record.erase();
                    view.fireEvent('save', record);
                }

                view.setLoading(true);
                reportFile.inputEl.setStyle('background-color', '#eee');
                optionsFile.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([name, reportType], {
                    url : criterion.consts.Api.API.REPORT_UPLOAD,
                    scope : this,
                    extraData : extraData,

                    success : Ext.Function.bind(function() {
                        view.setLoading(false);
                        view.fireEvent('afterSave');
                        view.destroy();
                    }),
                    failure : function() {
                        view.setLoading(false);
                    },
                    owner : me,
                    initialWidth : reportFile.inputEl.getWidth()
                }, me.handleUploadProgress);

                reportFile.inputEl.setStyle('width', '1px');
                optionsFile.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            var reportFile = owner && owner.lookupReference('reportFile'),
                optionsFile = owner && owner.lookupReference('optionsFile'),
                progress;

            if (event.lengthComputable && reportFile && reportFile.inputEl) {
                progress = parseInt(event.loaded / event.total * initialWidth, 10);
                reportFile.inputEl.setWidth(progress, true);
                optionsFile.inputEl.setWidth(progress, true);
            }
        }
    }
});
