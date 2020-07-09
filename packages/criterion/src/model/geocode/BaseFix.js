Ext.define('criterion.model.geocode.BaseFix', function() {

    const DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.GeoCode'
        ],

        fields : [
            {
                name : 'address1',
                type : 'string'
            },
            {
                name : 'address2',
                type : 'string'
            },
            {
                name : 'city',
                type : 'string'
            },
            {
                type : 'criterion_codedata',
                name : 'stateCd',
                allowNull : true,
                codeDataId : DICT.STATE
            },
            {
                type : 'criterion_codedata',
                name : 'countryCd',
                allowNull : true,
                codeDataId : DICT.COUNTRY
            },
            {
                name : 'countryCode',
                type : 'criterion_codedatavalue',
                referenceField : 'countryCd',
                dataProperty : 'attribute1'
            },
            {
                name : 'postalCode',
                type : 'string'
            },
            {
                name : 'county',
                type : 'string'
            },
            {
                name : 'currentGeocode',
                type : 'string'
            },
            {
                name : 'currentSchdist',
                type : 'string',
                allowNull : true
            },

            {
                name : 'newgeoCode',
                type : 'string',
                allowNull : true,
                persist : false
            },
            {
                name : 'geocode',
                type : 'string'
            },
            {
                name : 'schdist',
                type : 'string',
                allowNull : true
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.GeoCode',
                name : 'geocodes',
                associationKey : 'geocodes'
            }
        ],

        reloadGeoCodes() {
            let zip = this.get('postalCode'),
                countryCode = this.get('countryCode'),
                stateCd = this.get('stateCd'),
                city = this.get('city'),
                geocodes = this.geocodes(),
                dfd = Ext.create('Ext.Deferred');

            if (!zip || !countryCode) {
                dfd.resolve();
                return dfd.promise;
            }

            geocodes.removeAll();

            criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.GEOCODE_SEARCH,
                    method : 'GET',
                    params : {
                        zip,
                        countryCode,
                        stateCd,
                        city
                    }
                }
            ).then(result => {
                geocodes.add(Ext.clone(result));
                dfd.resolve();
            }, _ => {
                dfd.reject();
            });

            return dfd.promise;
        }
    };
});
