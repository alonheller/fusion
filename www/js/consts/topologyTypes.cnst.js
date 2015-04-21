angular.module('fusionLiveMobile.consts')
    .constant('topologyTypes', {
        'LOCATION': {innerType: 'location', outerType: 'Fusion.Types.Locations.Location, Fusion.Types'},
        'ASSET': {innerType: 'asset', outerType: 'Fusion.Types.Locations.Location, Fusion.Types'},
        'ASSET_MEASURE': {innerType: 'assetMeasure', outerType: 'Fusion.Types.Locations.Location, Fusion.Types'}
    })
