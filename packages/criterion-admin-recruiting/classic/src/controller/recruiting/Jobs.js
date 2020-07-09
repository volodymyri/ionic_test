Ext.define('criterion.controller.recruiting.Jobs', function() {

    var ROUTE = criterion.consts.Route.RECRUITING.JOBS;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_jobs',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        showGrid : function() {
            var form = this.lookupReference('jobForm'),
                jobDetails = this.lookupReference('jobDetails'),
                list = this.lookupReference('jobList'),
                mainScreen = this.lookupReference('mainScreen');

            mainScreen.show();
            list.getController().handleShow();

            form.hide();
            jobDetails.hide();

            setTimeout(function() {
                list.getController().load();
            }, 0); // controllers may not be fully initialized at this point
        },

        showForm : function(id, tab, subtab) {
            var jobForm = this.lookupReference('jobForm');

            this.lookupReference('mainScreen').hide();
            this.lookupReference('jobDetails').hide();
            jobForm.show();

            Ext.Function.defer(function() {
                jobForm.setActiveTab(tab || 0);
                subtab && jobForm.setSubMenuActiveTab(subtab || 0);
            }, 100);
        },

        showDetails : function(record) {
            var jobDetails = this.lookupReference('jobDetails');

            this.lookupReference('mainScreen').hide();
            this.lookupReference('jobForm').hide();

            jobDetails.getController().load(record);
            jobDetails.show();
        },

        onSearch : function() {
            var form = this.lookupReference('searchForm'),
                searchCriteria = form.getValues();

            Ext.Object.each(searchCriteria, function(key, value) {
                if (value === '' || value === false) {
                    // remove empty choices from criteria
                    delete searchCriteria[key];
                }
            });

            // fix CRITERION-2964
            if (form.down('criterion_employer_combo').getStore().count() === 1) {
                delete searchCriteria['employerId'];
            }

            this.lookupReference('jobList').getController().search(searchCriteria);
        },

        onJobAdd : function() {
            this.redirectTo(ROUTE + '/new');
        },

        onJobSelect : function(record) {
            this.redirectTo(ROUTE + '/' + record.getId());
        },

        init : function() {
            var routes = {};

            routes[ROUTE] = 'showGrid';
            routes[ROUTE + '/:id'] = 'showForm';
            routes[ROUTE + '/:id/:tab'] = 'showForm';
            routes[ROUTE + '/:id/:tab/:subtab'] = 'showForm';

            this.setRoutes(routes);
            this.setReRouting();

            this.callParent(arguments);
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.onSearch();
            }
        },

        handleSearchComboChange : function(cmp) {
            if (cmp.xtype === 'criterion_employer_combo' && cmp.getStore().count() === 1) {
                return;
            }

            this.onSearch();
        }
    };
});
