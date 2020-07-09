Ext.define('criterion.controller.settings.learning.course.JobsGridView', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_learning_course_jobs_grid_view',

        requires : [
            'criterion.store.Jobs',
            'criterion.view.MultiRecordPickerRemote',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        controller : {
            connectParentView : false
        },

        handleAddClick : function() {
            var me = this,
                store = this.getView().getStore(),
                jobMultiPicker;

            jobMultiPicker = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Job'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                dataIndex : 'code',
                                flex : 1
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Description'),
                                dataIndex : 'description',
                                flex : 1
                            }
                        ],
                        excludedIds : Ext.Array.map(store.getRange(), function(item) {
                            return item.get('jobId');
                        })
                    },
                    stores : {
                        inputStore : {
                            type : 'criterion_jobs',
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        }
                    }
                }
            });

            jobMultiPicker.on('selectRecords', me.addSelectJobs, me);

            jobMultiPicker.on('cancel', function() {
                me.setCorrectMaskZIndex(false);
            });

            jobMultiPicker.show();

            this.setCorrectMaskZIndex(true);
        },

        addSelectJobs : function(selectedRecords) {
            var vm = this.getViewModel(),
                store = this.getView().getStore(),
                courseRecord = vm.get('record'),
                courseCode = courseRecord.get('code');

            this.setCorrectMaskZIndex(true);

            Ext.Array.each(selectedRecords, function(jobRecord) {
                store.add({
                    code : jobRecord.get('code'), // persist, used only to display value in grid
                    courseId : courseRecord.getId(),
                    courseCode : courseCode,
                    jobId : jobRecord.getId()
                });
            });
        }
    };

});
