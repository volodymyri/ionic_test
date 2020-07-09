Ext.define('criterion.controller.common.positions.PositionSearch', function() {

    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.view.PositionPicker'
        ],

        alias : 'controller.criterion_positions_position_search',

        onSearch : function() {
            var view = this.getView();

            view.fireEvent('search', view.getSearchCriteria());
        },

        onPositionAdd : function() {
            this.redirectTo(this.getMainRoute() + '/new', null);
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.onSearch();
            }
        },

        employersComboReady : false,

        handleSearchComboLoaded : function() {
            this.employersComboReady = true;
        },

        handleSearchComboChange : function() {
            this.employersComboReady && this.onSearch();
        },

        handleCopyExisting : function() {
            var employerId = this.lookupReference('employerCombo').getValue(),
                conf = {},
                wnd;

            if (employerId) {
                conf.employerId = employerId;
            }

            wnd = Ext.create('criterion.view.PositionPicker', conf);

            wnd.show();
            wnd.on('select', function(record) {
                this.redirectTo(this.getMainRoute() + '/copy/' + record.getId());
            }, this);
        },

        getMainRoute : function() {
            return this.getView().up('criterion_positions').mainRoute || criterion.consts.Route.HR.POSITIONS;
        }
    };
});
