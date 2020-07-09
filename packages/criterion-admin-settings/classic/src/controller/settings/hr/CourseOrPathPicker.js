Ext.define('criterion.controller.settings.hr.CourseOrPathPicker', function() {

    var API = criterion.consts.Api.API,
        JOB_COURSE_TYPE = criterion.Consts.JOB_COURSE_TYPE;

    return {
        alias : 'controller.criterion_settings_hr_course_or_path_picker',

        extend : 'criterion.controller.MultiRecordPickerRemote',

        requires : [
            'criterion.store.employer.Courses',
            'criterion.store.learning.Paths'
        ],

        handleSearchTypeComboChange : function() {
            var currentSearchComboSelection = this.getViewModel().get('searchCombo.selection');

            if (currentSearchComboSelection) {
                this.loadWithParams();
            }
        },

        loadWithParams : function(params) {
            var me = this,
                vm = me.getViewModel(),
                selectedFilter = vm.get('searchCombo.selection'),
                isFilterByCourse = selectedFilter.get('type') === JOB_COURSE_TYPE.COURSE,
                employerId = vm.get('employerId');

            params = params || {};

            if (employerId) {
                params['employerId'] = employerId;
            }

            if (selectedFilter) {
                if (isFilterByCourse) {
                    params['isActive'] = true;
                }

                vm.setStores({
                    inputStore : Ext.create(
                        isFilterByCourse ? 'criterion.store.employer.Courses' : 'criterion.store.learning.Paths',
                        {
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        }
                    )
                });

                vm.set({
                    isFilterByCourse : isFilterByCourse,
                    title : isFilterByCourse ? i18n.gettext('Select Course') : i18n.gettext('Select Learning Path')
                });
            }

            me.callParent([params]);
        }
    }
});
