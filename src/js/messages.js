grabMSG = function(type, code, raw) {
	if (type != undefined && code != undefined){
		var message = messages[type][code][properties.userLanguage] || 'Error';

		if (raw){
			return messages[type][code][properties.userLanguage];
		}
		else {
			return '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + messages[type][code][properties.userLanguage];
		}
	}
	else {
		return 'Invalid type or code';
	}
}

var messages = {
	error:{
		204: {
			en: 'No Content',
			es: 'add translation.',
			zh: 'add translation.'
		}
	},
	success:{
		emailSent: {
			en: 'Please check your email for further instructions.',
			es: 'add translation.',
			zh: 'add translation.'
		}
	},
	data: {
		modes: {
			en: {
				'transit': 'Transit',
				'bike': 'Bike',
				'walk': 'Walk',
				'carpool': 'Carpool',
				'multimodal': 'Multimodal'
			}
		}
	}
}