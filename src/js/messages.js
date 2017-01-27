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
		},
		400: {
			en: 'Bad Request',
			es: 'add translation.',
			zh: 'add translation.'
		},
		403: {
			en: 'Forbidden',
			es: 'add translation.',
			zh: 'add translation.'
		},
		404: {
			en: 'Not Found',
			es: 'add translation.',
			zh: 'add translation.'
		},
		409: {
			en: 'Conflict',
			es: 'add translation.',
			zh: 'add translation.'
		},
		503: {
			en: 'Service Unavailable',
			es: 'add translation.',
			zh: 'add translation.'
		},
		ajaxError: {
			en: 'Unable to complete your request at this time.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		incompleteForm: {
			en: 'Please fill out all required areas.',
			es: 'Por favor llene todas las preguntas requeridas.',
			zh: '请填写所有必填的问题。'
		},
		passwordUnmatched: {
			en: 'Passwords do not match.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		duplicateEmail: {
			en: 'Email Address is already registered.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		emailUnmatched: {
			en: 'Emails do not match.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		invalidEmail: {
			en: 'Email Address is invalid.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		noReward: {
			en: 'Sorry, no rewards in stock at this time.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		noEmail: {
			en: 'Email Address does not exist.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		captchaFail: {
			en: 'Captcha code is incorrect.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		loginFail: {
			en: 'Incorrect password and/or email address.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		invalidToken: {
			en: 'A request to reset the password is needed first.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		expiredToken: {
			en: 'The request to reset this password has expired.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		storyMin: {
			en: 'Your story must be 100 words or greater.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		imageFail: {
			en: 'Photo must be under 5 MB and be a gif, jpg, or png.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		noTrips: {
			en: 'No trips have been logged yet!',
			es: 'add translation.',
			zh: 'add translation.'
		},
		tripDateInvalid: {
			en: 'Trips must be made on or after 2/22/17.',
			es: 'add translation.',
			zh: 'add translation.'
		}
	},
	success:{
		emailSent: {
			en: 'Please check your email for further instructions.',
			es: 'add translation.',
			zh: 'add translation.'
		},
		signUpComplete: {
			en: 'Thanks for signing up!',
			es: 'add translation.',
			zh: 'add translation.'
		},
		tripLogged: {
			en: 'Trip has been successfully logged!',
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
			},
			es: {
				'transit': 'Transit',
				'bike': 'Bike',
				'walk': 'Walk',
				'carpool': 'Carpool',
				'multimodal': 'Multimodal'
			},
			zh: {
				'transit': 'Transit',
				'bike': 'Bike',
				'walk': 'Walk',
				'carpool': 'Carpool',
				'multimodal': 'Multimodal'
			}
		},
		purpose: {
			en: {
				'work': 'Work',
				'shop': 'Shop',
				'school': 'School',
				'appointment': 'Appointment',
				'recreation': 'Recreation',
				'other': 'Other'
			},
			es: {
				'work': 'Work',
				'shop': 'Shop',
				'school': 'School',
				'appointment': 'Appointment',
				'recreation': 'Recreation',
				'other': 'Other'
			},
			zh: {
				'work': 'Work',
				'shop': 'Shop',
				'school': 'School',
				'appointment': 'Appointment',
				'recreation': 'Recreation',
				'other': 'Other'
			}
			
		}
	}
}