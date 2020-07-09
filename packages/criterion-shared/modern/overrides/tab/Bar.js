Ext.define('criterion.overrides.tab.Bar', {

    override : 'Ext.tab.Bar',

    defaultBindProperty : 'activeTab',

    twoWayBindable : [
        'activeTab'
    ]

});
