Ext.define('criterion.controller.settings.hr.TaskGroupDetails', function() {

    return {
        alias : 'controller.criterion_settings_task_group_details',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.store.employer.Tasks',
            'criterion.view.MultiRecordPickerRemote',
            'criterion.model.employer.TaskGroup'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAddTaskGroupDetail : function() {
            var me = this,
                view = me.getView(),
                store = view.getStore(),
                selectTaskDetails;

            selectTaskDetails = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Tasks'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1
                            }
                        ],
                        storeParams : {
                            employerId : criterion.Api.getEmployerId(),
                            isActive : true
                        },
                        excludedIds : Ext.Array.map(store.getRange(), function(item) {
                            return item.get('taskId');
                        })
                    },
                    stores : {
                        inputStore : Ext.create('criterion.store.employer.Tasks', {
                            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                            remoteFilter : true,
                            remoteSort : true
                        })
                    }
                }
            });

            selectTaskDetails.show();
            selectTaskDetails.on('selectRecords', me.selectTaskDetails, me);

            me.setCorrectMaskZIndex(true);
        },

        selectTaskDetails : function(selectedRecords) {
            var me = this;

            me.setCorrectMaskZIndex(false);

            Ext.Array.each(selectedRecords, function(record) {
                me.addRecord({
                    taskId : record.getId(),
                    name : record.get('name')
                }).$relatedPhantom = true;
            });
        },

        reloadData : function() {
            var me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                record = vm.get('record'),
                showInactive = me.lookup('showInactive'),
                taskGroup = Ext.create('criterion.model.employer.TaskGroup', {id : record.getId()}),
                params = {};

            if (showInactive && !showInactive.getValue()) {
                params = Ext.apply(params, {activeOnly : true});
            }

            view.setLoading(true);

            taskGroup.loadWithPromise({
                params : params
            }).then(function() {
                vm.set('record', taskGroup);
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleChangeShowInactive : function() {
            this.reloadData();
        },

        handleRefreshClick : function() {
            this.reloadData();
        }
    };
});
