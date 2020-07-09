Ext.define('criterion.view.ess.time.TeamTimeOffs', function() {

    return {

        alias : 'widget.criterion_selfservice_time_team_time_offs',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.ess.time.teamTimeOffs.List',
            'criterion.view.ess.time.TeamTimeOffDashboard'
        ],

        viewModel : {
            data : {
                activeViewIdx : 0
            }
        },

        layout : 'card',

        bind : {
            activeItem : '{activeViewIdx}'
        },

        listeners : {
            beforehide : 'handleReturnToTeamDashboard',
            scope : 'this'
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_selfservice_time_team_time_offs_list',
                    reference : 'grid',
                    replaceTitle : true,
                    listeners : {
                        goEmployeeTimeOff : 'handleGoToEmployeeTimeOff',
                        showLoadingState : function() {
                            this.setLoading(true);
                        },
                        hideLoadingState : function() {
                            this.setLoading(false)
                        },
                        scope : this
                    }
                },
                {
                    xtype : 'criterion_selfservice_team_time_time_off_dashboard',
                    replaceTitle : true,
                    cls : 'criterion-ess-panel',
                    reference : 'timeOffDashboard',
                    isTeamTimeOff : true,
                    listeners : {
                        returnToTeamDashboard : 'handleReturnToTeamDashboard',
                        scope : this
                    }
                }
            ];

            this.callParent(arguments);
        },

        handleGoToEmployeeTimeOff : function(ttoRec) {
            var timeOffDashboard = this.down('[reference=timeOffDashboard]'),
                store = ttoRec.store,
                clonedStore = Ext.create('criterion.store.employee.TeamTimeOffs');

            if (store && store.isStore) {
                store.cloneToStore(clonedStore);
            }

            timeOffDashboard.getViewModel().set({
                teamTimeOffEmployeeId : ttoRec.get('employeeId'),
                teamTimeOffs : clonedStore,
                managerMode : true
            });
            this.getLayout().setActiveItem(timeOffDashboard);
        },

        handleReturnToTeamDashboard : function() {
            var timeOffDashboard = this.down('[reference=timeOffDashboard]'),
                grid = this.down('[reference=grid]');

            timeOffDashboard.getViewModel().set('teamTimeOffEmployeeId', null);
            this.getLayout().setActiveItem(grid);
            grid.getController().load();
        }
    };

});
