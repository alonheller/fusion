angular.module('fusionLiveMobile.services')

    .factory('ticketsService', function (commonDataService) {
        var getTicketReasonName = function (ticketReasonID) {
            var ticketReason = getTicketReason(ticketReasonID);
            return ticketReason ? ticketReason.Name : null;
        };

        function getTicketReason(ticketReasonID)
        {
            var ticketReasons;
            var tickets = commonDataService.getTicketReasons();
            for (var i = 0; i < tickets.length; i++) {
                if (tickets[i].ID == ticketReasonID) {
                    ticketReasons = tickets[i];
                    break;
                }
            }

            return ticketReasons;
        }

        return {
            getTicketReasonName: function(ticketReasonID) {
                return getTicketReasonName(ticketReasonID);
            }
        }
    });