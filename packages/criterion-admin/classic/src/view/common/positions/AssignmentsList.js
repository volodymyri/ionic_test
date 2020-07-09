Ext.define('criterion.view.common.positions.AssignmentsList', function() {

    return {
        alias : 'widget.criterion_positions_assignments_list',

        extend : 'criterion.ux.window.Window',

        requires: [
            'criterion.store.Assignments'
        ],

        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
        bodyPadding : 10,

        modal : true,
        closable : true,
        resizable : false,

        viewModel : {
            data: {
                /**
                 * @see {criterion.model.Position}
                 */
                position: null
            },
            stores : {
                assignments : {
                    type : 'criterion_assignments'
                }
            }
        },

        bind: {
            title: 'Assigned Employees for {position.code}'
        },

        items: [
            {
                xtype: 'grid',

                bind : {
                    store : '{assignments}'
                },

                columns: [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        dataIndex : 'personName',
                        flex: 1
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Start Date'),
                        dataIndex : 'startDate',
                        width: 120
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('End Date'),
                        dataIndex : 'endDate',
                        width: 120
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Close'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : function() {
                        this.up('window').destroy();
                    }
                }
            }
        ],

        load: function() {
            var view = this,
                assignments = this.getViewModel().get('assignments');

            view.setLoading(true);

            assignments.load({
                params: {
                    positionId: this.getViewModel().get('position').getId()
                },
                callback: function() {
                    setTimeout(function(){
                        view.setLoading(false);
                        view.center();
                    }, 100)
                }
            });
        }
    };

});
