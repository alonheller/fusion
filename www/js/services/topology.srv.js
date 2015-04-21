angular.module('fusionLiveMobile.services')

    .factory('topologyService', function ($q, $rootScope, networkService, topologyTypes, statusCodes, commonDataService) {
        var topology;

        var locationCache = {};         // locationCache[locationId] = location + locationParentId + level-1 children
        var assetCache = {};            // assetCache[assetId] = asset
        var assetMeasureCache = {};     // assetMeasureCache[assetMeasureId] = assetMeasure

        var assetToLocation = {};       // assetToLocation[assetId] = locationId
        var locationToAssets = {};      // locationToAssets[locationId] = [assetIDs]

        var assetToAssetMeasures = {}   // asset[assetId] = [assetMeasures]
        var assetMeasureToAsset = {};   // assetMeasureToAsset[assetMeasureId] = assetId

        var item = function (type, obj, hasChildren) {
            var item = {type: type, obj: obj, hasChildren: hasChildren};
            return item;
        }

        var Location = function (obj, recursive) {
            var location = {};

            location.hasChildren = obj.Children && obj.Children.$values.length > 0;
            location.hasAssets = obj.Assets && obj.Assets.$values.length > 0;
            location.type = topologyTypes.LOCATION.innerType;
            location.name = obj.Name;
            location.id = obj.ID;
            location.parentId = obj.ParentID;
            location.status = commonDataService.getStatusName(obj.StatusCode);
            location.children = [];
            if (recursive != false && obj.Children && obj.Children.$values.length > 0) {
                angular.forEach(obj.Children.$values, function (locChildren, key) {
                    location.children.push(new Location(locChildren, false));
                });
            }

            return location;
        }

        var Asset = function (obj) {
            var asset = {};

            asset.hasMeasures = obj.Measures && obj.Measures.$values.length > 0;
            asset.type = topologyTypes.ASSET.innerType;
            asset.name = obj.Name;
            asset.id = obj.ID;
            asset.endDate = obj.EndDate;
            asset.assetTypeID = obj.AssetTypeID;
            asset.locationId = obj.LocationID;
            asset.status = commonDataService.getStatusName(obj.StatusCode);
            //TODO: TAGs
            // asset.tags =

            assetToLocation[obj.ID] = obj.LocationID;

            if (locationToAssets[obj.LocationID]) {
                locationToAssets[obj.LocationID].push(obj.ID);
            }
            else {
                locationToAssets[obj.LocationID] = [obj.ID];
            }

            return asset;
        }

        var AssetMeasure = function (obj) {
            var assetMeasure = {};

            assetMeasure.name = obj.Name;
            assetMeasure.id = obj.ID;
            assetMeasure.type = topologyTypes.ASSET_MEASURE.innerType;
            assetMeasure.alarmBypass = obj.AlarmBypass;
            assetMeasure.alarmClear = obj.AlarmClear;
            assetMeasure.alarmDelay = obj.AlarmDelay;
            assetMeasure.alarmDeviation = obj.AlarmDeviation;
            assetMeasure.alarmDigital = obj.AlarmDigital;
            assetMeasure.alarmHigh = obj.AlarmHigh;
            assetMeasure.alarmLow = obj.AlarmLow;
            assetMeasure.alarmTypeID = obj.AlarmTypeID;
            assetMeasure.assetID = obj.AssetID;
            assetMeasure.assetMeasureTypeID = obj.AssetMeasureTypeID;
            assetMeasure.endDate = obj.EndDate;
            assetMeasure.falseString = obj.FalseString;
            assetMeasure.measureID = obj.MeasureID;
            assetMeasure.measureUnitID = obj.MeasureUnitID;
            assetMeasure.precision = obj.Precision;
            assetMeasure.rowState = obj.RowState;
            assetMeasure.status = commonDataService.getStatusName(obj.StatusCode);
            assetMeasure.trueString = obj.TrueString;
            assetMeasure.warningHigh = obj.WarningHigh;
            assetMeasure.warningLow = obj.WarningLow;

            assetMeasureToAsset[obj.ID] = obj.AssetID;

            if (assetToAssetMeasures[obj.AssetID]) {
                assetToAssetMeasures[obj.AssetID].push(obj.ID);
            }
            else {
                assetToAssetMeasures[obj.AssetID] = [obj.ID];
            }

            return assetMeasure;
        }

        var Ticket = function (obj) {
            var ticket = {};

            ticket.acknowledged = obj.Acknowledged;    // false
            ticket.assetID = obj.AssetID;
            ticket.assetMeasureName = obj.AssetMeasureName;
            ticket.assetName = obj.AssetName;
            ticket.assetTypeName = obj.AssetTypeName;
            ticket.closedBy = obj.ClosedBy;
            ticket.closerTypeID = obj.CloserTypeID;
            ticket.cost = obj.Cost;
            ticket.createdBy = obj.CreatedBy;
            ticket.createdOn = obj.CreatedOn;
            ticket.deviceID = obj.DeviceID;
            ticket.deviceTypeID = obj.DeviceTypeID;
            ticket.id = obj.ID;
            ticket.inWarranty = obj.InWarranty;
            ticket.locationID = obj.LocationID;
            ticket.locationName = obj.LocationName;
            ticket.manufacturer = obj.Manufacturer;
            ticket.modelNumber = obj.ModelNumber;
            ticket.objectID = obj.ObjectID;
            ticket.objectName = obj.ObjectName;
            ticket.objectTypeID = obj.ObjectTypeID;
            ticket.prevMainID = obj.PrevMainID;
            ticket.serialNumber = obj.SerialNumber;
            ticket.shouldClose = obj.ShouldClose;
            ticket.ticketActionID = obj.TicketActionID;
            ticket.ticketActionName = obj.TicketActionName;
            ticket.ticketCauseID = obj.TicketCauseID;
            ticket.ticketCauseName = obj.TicketCauseName;
            ticket.ticketReasonID = obj.TicketReasonID;
            ticket.ticketReasonName = obj.TicketReasonName;

            return ticket;
        }

        function populateMapsRecursivly(node) {
            angular.forEach(node, function (value, key) {

                var location = new Location(value);
                locationCache[value.ID] = location;
                angular.forEach(value.Assets.$values, function (asset, assetKey) {
                    assetCache[asset.ID] = new Asset(asset);
                    angular.forEach(asset.Measures.$values, function (assetMeasure, assetMeasureKey) {
                        assetMeasureCache[assetMeasure.ID] = new AssetMeasure(assetMeasure);
                    });
                });

                populateMapsRecursivly(value.Children.$values);
            });
        }

        function getRootLocation() {
            if (!topology) {
                var deferred = $q.defer();
                getRoot().then(
                    function success(result) {
                        deferred.resolve(locationCache[topology[0].ID]);
                        console.log('Fire event topologyRefreshEvent');
                        $rootScope.$broadcast('topologyRefreshEvent');
                    },
                    function error(result) {
                        deferred.reject(result);
                    }
                )
                return deferred.promise;
            }
            else {
                return locationCache[topology[0].ID];
            }
        }

        function getRoot() {
            var deferred = $q.defer();

            networkService.getUserLocations().then(
                function success(result) {
                    topology = result;
                    populateMapsRecursivly(result);
                    var items = getItemChildren(-1);
                    deferred.resolve(items);
                },
                function error(result) {
                    deferred.reject();
                }
            );

            return deferred.promise;
        }

        function getItemMeasures(assetId) {
            var items = [];
            var assetMeasureIDs = assetToAssetMeasures[assetId];

            angular.forEach(assetMeasureIDs, function (assetMeasureId, key) {
                items.push(assetMeasureCache[assetMeasureId]);
            });

            return items;
        }

        function getItemChildren(locationId) {
            var items = [];

            items.push(new Location({'Children': false, Assets: false, 'Name': 'Location-1', 'ID': 1, 'ParentID': null, StatusCode: 'OK'}));
            items.push(new Location({'Children': false, Assets: false, 'Name': 'Location-2', 'ID': 2, 'ParentID': null, StatusCode: 'OK'}));
            items.push(new Location({'Children': false, Assets: false, 'Name': 'Location-3', 'ID': 3, 'ParentID': null, StatusCode: 'OK'}));
            items.push(new Location({'Children': false, Assets: false, 'Name': 'Location-4', 'ID': 4, 'ParentID': null, StatusCode: 'OK'}));
            items.push(new Location({'Children': false, Assets: false, 'Name': 'Location-5', 'ID': 5, 'ParentID': null, StatusCode: 'OK'}));
            items.push(new Location({'Children': false, Assets: false, 'Name': 'Location-6', 'ID': 6, 'ParentID': null, StatusCode: 'OK'}));



            /*if (locationId == -1 || !locationCache[locationId]) {
                // return root
                angular.forEach(topology, function (loc, key) {
                    var location = new Location(loc);
                    items.push(location);
                });
            }
            else {
                // locations
                items = angular.copy(locationCache[locationId].children);

                // assets
                if (locationToAssets[locationId]) {
                    var assetIds = locationToAssets[locationId];
                    angular.forEach(assetIds, function (assetId, assetIdKey) {
                        items.push(assetCache[assetId]);
                    });
                }
            }*/

            return items;
        }

        function getLocationInfo(locationId) {
            var info = {};

            var deferred = $q.defer();

            info.Name = 'Meduza';
            info.AddressText = 'Jenkins St. 13 way';
            info.City = 'Holon';
            info.State = 'Israel';
            info.PostalCode = '12345';
            info.Country = 'Vladimir';
            info.Phone1 = '972-3-5515510';
            info.Phone2 = '972-3-2333984';
            info.MobilePhone = '972-52-2333984';
            info.Fax = '972-3-5550000';
            info.Email = 'Vladi@gmail.com';
            info.URL = 'www.vladi.com';

            deferred.resolve(info);

            return deferred.promise;

        }

        function getAssetInformation(assetId) {
            return networkService.getAssetInfo(assetId);
        }

        function getLocationTickets(locationId) {
            var d = new Date();
            return networkService.getLocationTickets(locationId, true, d, d);
        }

        function getAssetTickets(assetId) {
            var d = new Date();
            return networkService.getAssetTickets(assetId, true, d, d);
        }

        function getAssetMeasureInformation(assetMeasureId) {
            return networkService.getAssetMeasureInformation(assetMeasureId);
        }

        function getLocationSummary(locationId) {
            return networkService.getLocationSummary(locationId);
        }

        function getAssetSummary(assetId) {
            return networkService.getAssetSummary(assetId);
        }

        return {
            getRoot: function () {
                return getRoot();
            },
            getRootLocation: function () {
                return getRootLocation()
            },
            getLocationInfo: function (locationId) {
                return getLocationInfo(locationId)
            },
            getItemChildren: function (locationId) {
                return getItemChildren(locationId)
            },
            getItemMeasures: function (assetId) {
                return getItemMeasures(assetId)
            },
            getLocation: function (locationId) {
                return locationCache[locationId]
            },
            getAsset: function (assetId) {
                return assetCache[assetId]
            },
            getAssetMeasure: function (assetMeasureId) {
                return assetMeasureCache[assetMeasureId]
            },
            getAssetInformation: function (assetId) {
                return getAssetInformation(assetId)
            },
            getAssetMeasureInformation: function (assetMeasureId) {
                return getAssetMeasureInformation(assetMeasureId)
            },
            getLocationTickets: function (locationId) {
                return getLocationTickets(locationId)
            },
            getAssetTickets: function (assetId) {
                return getAssetTickets(assetId)
            },
            getLocationSummary: function(locationId) {
                return getLocationSummary(locationId)
            },
            getAssetSummary: function(assetId) {
                return getAssetSummary(assetId)
            }
        }
    });