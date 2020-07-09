Ext.define('criterion.controller.TaskPicker', function() {

    const API = criterion.consts.Api.API,
        TASK_FILTER_TYPES = criterion.Consts.TASK_FILTER_TYPES;

    return {
        alias : 'controller.criterion_task_picker',

        extend : 'criterion.controller.MultiRecordPickerRemote',

        requires : [
            'criterion.store.employer.Tasks',
            'criterion.store.employer.TaskGroups',
            'criterion.store.employer.Projects'
        ],

        handleSearchTypeComboChange : function() {
            let me = this,
                currentSelFilter = me.getViewModel().get('searchCombo.selection');

            me.callParent(arguments);

            if (currentSelFilter) {
                me.loadWithParams();
            }
        },

        loadWithParams : function(params) {
            let me = this,
                vm = me.getViewModel(),
                currentSelFilter = vm.get('searchCombo.selection'),
                filterType = currentSelFilter.get('type'),
                store = me.getStore('inputStore');

            params = params || {};

            params['employerId'] = vm.get('employerId');

            switch (filterType) {
                case TASK_FILTER_TYPES.TASK:
                    vm.setStores({
                        inputStore : Ext.create('criterion.store.employer.Tasks', {
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        })
                    });
                    store.getProxy().setUrl(API.EMPLOYER_TASK);
                    vm.set({
                        isTasksActive : true,
                        isTaskGroupsActive : false,
                        isProjectsActive : false
                    });

                    break;

                case TASK_FILTER_TYPES.GROUP:
                    vm.setStores({
                        inputStore : Ext.create('criterion.store.employer.TaskGroups', {
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        })
                    });
                    store.getProxy().setUrl(API.EMPLOYER_TASK_GROUP);
                    vm.set({
                        isTasksActive : false,
                        isTaskGroupsActive : true,
                        isProjectsActive : false
                    });

                    break;

                case TASK_FILTER_TYPES.PROJECT:
                    vm.setStores({
                        inputStore : Ext.create('criterion.store.employer.Projects', {
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        })
                    });
                    store.getProxy().setUrl(API.EMPLOYER_PROJECT);
                    vm.set({
                        isTasksActive : false,
                        isTaskGroupsActive : false,
                        isProjectsActive : true
                    });

                    break;
            }

            me.callParent([params]);
        }
    }
});
