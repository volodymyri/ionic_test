Ext.define('criterion.controller.settings.recruiting.PublishingSite', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_recruiting_publishing_site',

        onCopy : function() {
            var frameCode = this.lookup('frameCode'),
                textAreaQuery = frameCode && frameCode.el.query('textarea'),
                textArea = textAreaQuery.length && textAreaQuery[0];

            textArea && textArea.select();

            try {
                var copied = document.execCommand('copy');

                if (copied) {
                    criterion.Utils.toast(i18n.gettext('Successfully.'));
                }
            } catch (e) {
            }
        },

        onSave : function(record) {
            var me = this,
                view = this.getView(),
                publishSiteSetting = record.getPublishSiteSetting();

            if (record.dirty || record.phantom || (publishSiteSetting && publishSiteSetting.dirty)) {
                publishSiteSetting.phantom = true;
                record.save({
                    params : me.getRecordSaveParams(),
                    success : function(rec) {
                        me.onAfterSave.call(me, view, rec);
                    },
                    failure : function(rec, operation) {
                        me.onFailureSave(rec, operation);
                    }
                });
            } else {
                me.onAfterSave.call(me, view, record);
            }
        },

        onAfterSave : function() {
            criterion.Utils.toast(i18n.gettext('Saved.'));
        },

        onCancel : function(form, record) {
            var association = record.associations['publishSiteSetting'],
                getter = association.getterName,
                getterFunc = record[getter];

            if (Ext.isFunction(getterFunc)) {
                var siteSettings = getterFunc.call(record);

                if (siteSettings && siteSettings.dirty) {
                    siteSettings.reject();
                }
            }
        },

        onIsListShowDepartmentChange : function(cmp, value) {
            var jobListingFormats = this.getViewModel().getStore('jobListingFormats'),
                jobListingFormat = this.lookup('jobListingFormat'),
                needResetJobListingFormat = Ext.Array.contains(
                    [
                        criterion.Consts.JOB_LISTING_FORMATS.BY_DEPARTMENT,
                        criterion.Consts.JOB_LISTING_FORMATS.BY_DEPARTMENT_WORK_LOCATION,
                        criterion.Consts.JOB_LISTING_FORMATS.BY_WORK_LOCATION_DEPARTMENT
                    ], jobListingFormat.getValue()
                );

            jobListingFormats.clearFilter();

            if (!value) {
                jobListingFormats.filterBy(function(record) {
                    return !Ext.Array.contains(
                        [
                            criterion.Consts.JOB_LISTING_FORMATS.BY_DEPARTMENT,
                            criterion.Consts.JOB_LISTING_FORMATS.BY_DEPARTMENT_WORK_LOCATION,
                            criterion.Consts.JOB_LISTING_FORMATS.BY_WORK_LOCATION_DEPARTMENT
                        ], record.get('value')
                    );
                });

                if (needResetJobListingFormat) {
                    jobListingFormat.setValue();
                }
            }
        }
    };

});
