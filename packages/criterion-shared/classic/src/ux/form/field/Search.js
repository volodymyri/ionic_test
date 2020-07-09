Ext.define('criterion.ux.form.field.Search', {

    alias : 'widget.criterion_search_field',

    extend : 'Ext.form.field.Text',

    ui : 'search',

    triggers : {
        search : {
            cls : Ext.baseCSSPrefix + 'form-search-trigger'
        }
    }
});