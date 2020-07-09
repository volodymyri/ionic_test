Ext.define('criterion.overrides.field.Date', {

    override : 'Ext.field.Date',

    config : {
        picker : {
            lazy : true,
            $value : 'floated'
        }
    }

});
