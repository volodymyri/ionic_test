Ext.define('ess.controller.PersonalInformation', function() {

    return {

        extend : 'criterion.controller.ess.PersonalInformation',

        alias : 'controller.ess_modern_personal_information',

        load : function() {
            this.getView().setActiveItem(this.lookup('subMenu'));
            this.callParent(arguments);
        },

        /**
         * @param reference
         * @returns {Ext.util.Collection}
         */
        getSectionFields : function(reference) {
            var collection = new Ext.util.Collection();

            collection.add(this.lookup(reference).getFieldsAsArray());

            return collection;
        },

        onSubPageTap : function(cmp) {
            var view = this.getView(),
                subPage = this.lookup(cmp.goPage);

            view.getLayout().setAnimation({
                type : 'slide',
                direction : 'left'
                }
            );

            view.setActiveItem(subPage);
        },

        onSubPageBack : function() {
            var view = this.getView();

            view.getLayout().setAnimation({
                type : 'slide',
                direction : 'right'
                }
            );

            view.setActiveItem(this.lookup('subMenu'));
        }
    };
});
