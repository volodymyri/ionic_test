Ext.define('criterion.controller.common.positions.PositionList', function() {

    let gridPositionStore;

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_positions_position_list',

        mixins : [
            'criterion.controller.mixin.SingleEmployer'
        ],

        search : function(searchCriteria) {
            let view = this.getView(),
                positions = this.getView().getStore(),
                pos = gridPositionStore.getItem('pos'),
                posData = pos && pos.split('-');

            positions.getProxy().setExtraParams(searchCriteria);
            positions.loadPage(posData ? posData[0] : 1, {
                callback : function() {
                    gridPositionStore.removeItem('pos');

                    if (posData && posData[1]) {
                        view.setScrollY(posData[1], true);
                    }
                }
            });
        },

        getMainRoute : function() {
            return this.getView().up('criterion_positions').mainRoute || criterion.consts.Route.HR.POSITIONS;
        },

        onSelect : function(grid, record) {
            let view = this.getView(),
                positions = this.getView().getStore(),
                id = record.getId();

            gridPositionStore.setItem('pos', positions.currentPage + '-' + view.getScrollY());
            this.redirectTo(this.getMainRoute() + '/' + id, null);
        },

        handleEditAction : function(record) {
            let positions = this.getView().getStore(),
                id = record.getId();

            gridPositionStore.setItem('pos', positions.currentPage + '-' + id);

            this.redirectTo(this.getMainRoute() + '/' + record.getId(), null);
        },

        onGoToProfile : function(record) {
            var positionId = record.getId(),
                primaryAssignedEmployeeId = record.get('primaryAssignedEmployeeId'),
                assignmentsCount = record.get('assignmentsCount');

            if (assignmentsCount > 1) {
                this.redirectTo(criterion.consts.Route.HR.EMPLOYEES + '/' + positionId, null);
            } else if (primaryAssignedEmployeeId) {
                criterion.consts.Route.setPrevRoute(this.getMainRoute());

                this.redirectTo(criterion.consts.Route.HR.EMPLOYEES + '/goto/' + primaryAssignedEmployeeId, null);
            }
        },

        remove : function(record) {
            var store = this.getView().getStore();
            store.remove(record);
            store.sync();
        },

        handleIsSingleEmployer : function() {
            this.getView().down('gridcolumn[dataIndex=employerLegalName]').setHidden(true);
        },

        init : function() {
            var view = this.getView(),
                positions = view.getStore();

            this.search = Ext.Function.createBuffered(this.search, 1000, this);

            gridPositionStore = new Ext.util.LocalStorage({
                id : 'positionGrid'
            });

            positions.on('beforeload', function() {
                view.setLoading(true);
            }, this);
            positions.on('load', function() {
                view.setLoading(false);
            }, this);
            positions.on('error', function() {
                view.setLoading(false);
            }, this);

            this.callParent(arguments);
        }
    };
});
