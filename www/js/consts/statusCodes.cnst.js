angular.module('fusionLiveMobile.consts')
    .constant('statusCodes', {
        'NOT_DEFINED': -1,
        'NOT_AVAILABLE': 0,
        'OK':  1,
        'WARNING': 2,
        'CRITICAL': 4,
        'FAULT': 5,
        'FAULT_OPEN': 6,
        'FAULT_SHORTED': 7,
        'FAULT_COMM': 8,
        'DISCONNECTED': 9
    })