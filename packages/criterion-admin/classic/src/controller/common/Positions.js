Ext.define('criterion.controller.common.Positions', function() {

    var NEW_POSITION_COPY = 'copy';

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_positions',

        showGrid : function() {
            var me = this,
                positionForm = this.lookupReference('positionForm'),
                mainScreen = this.lookupReference('mainScreen'),
                positionSearch = this.lookupReference('positionSearch'),
                searchCriteria;

            mainScreen.show();
            mainScreen.down('criterion_positions_position_list').getController().handleShow();

            setTimeout(function() {
                searchCriteria = positionSearch.getSearchCriteria();
                me.onSearch(searchCriteria);
            }, 0); // controllers may not be fully initialized at this point

            positionForm.hide();
        },

        handleActivate : function() {
            this.showGrid();
        },

        showForm : function(id, tab, subtab) {
            var positionForm = this.lookupReference('positionForm'),
                isPositionFormHidden = positionForm.hidden;

            this.lookupReference('mainScreen').hide();
            positionForm.show();

            if (id === NEW_POSITION_COPY) {
                positionForm.getController().copyPosition(tab);
                Ext.Function.defer(function() {
                    positionForm.setActiveTab(0);
                    positionForm.setSubMenuActiveTab(0);
                }, 100);
                return;
            }

            if (isPositionFormHidden) {
                positionForm.getController().load(id);
            }

            Ext.Function.defer(function() {
                positionForm.setActiveTab(tab || 0);
                positionForm.setSubMenuActiveTab(subtab || 0);
            }, 100);
        },

        onSearch : function(searchCriteria) {
            this.lookupReference('positionList').getController().search(searchCriteria);
        },

        init : function() {
            var routes = {},
                mainRoute = this.getView().mainRoute;

            routes[mainRoute] = 'showGrid';
            routes[mainRoute + '/:id'] = 'showForm';
            routes[mainRoute + '/:id/:tab'] = 'showForm';
            routes[mainRoute + '/:id/:tab/:subtab'] = 'showForm';

            this.setRoutes(routes);

            this.showGrid = Ext.Function.createBuffered(this.showGrid, 100, this);
            this.showForm = Ext.Function.createBuffered(this.showForm, 100, this);

            this.callParent(arguments);
        },

        onSaved : function() {
            criterion.Utils.toast(i18n.gettext('Position Saved.'));
        }
    };
});
