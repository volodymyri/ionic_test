Ext.define('criterion.controller.settings.learning.PathCourses', function() {

    return {
        alias : 'controller.criterion_settings_learning_path_courses',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.store.employer.Courses',
            'criterion.store.learning.PathCourses',
            'criterion.view.MultiRecordPickerRemoteAlt'
        ],

        handleRefreshClick : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                learningPathId = vm.get('record.id'),
                gridStore = view.getStore();

            gridStore.loadWithPromise({
                params : {
                    learningPathId : learningPathId
                }
            });
        },

        handleAddClick : function() {
            var me = this,
                view = me.getView(),
                vm = this.getViewModel(),
                record = vm.get('record'),
                courses = Ext.create('criterion.store.employer.Courses', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedCourses = Ext.create('criterion.store.employer.Courses'),
                gridStore = view.getStore(),
                storeParams = {
                    employerId : record.get('employerId'),
                    isActive : true
                },
                excludedIds = [],
                selectCoursesWindow;

            gridStore.each(function(rec) {
                excludedIds.push(rec.get('courseId'));

                selectedCourses.add({
                    id : rec.get('courseId')
                });
            });

            selectCoursesWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Add Courses'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                flex : 1,
                                dataIndex : 'code'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                flex : 1,
                                dataIndex : 'name'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Course Type'),
                                flex : 1,
                                dataIndex : 'courseType',
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : storeParams,
                        allowDeleteSelected : false
                    },
                    stores : {
                        inputStore : courses,
                        excludedIds : excludedIds,
                        selectedStore : selectedCourses
                    }
                }
            });

            selectCoursesWindow.on({
                selectRecords : function(records) {
                    Ext.Array.each(records, function(rec) {
                        if (Ext.Array.contains(excludedIds, rec.getId())) {
                            return;
                        }

                        gridStore.add({
                            courseId : rec.getId(),
                            learningPathId : record.getId(),
                            name : rec.get('name'),
                            courseType : rec.get('courseType')
                        });
                    });
                }
            });

            selectCoursesWindow.show();
        }
    };
});
