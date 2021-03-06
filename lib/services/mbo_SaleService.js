/**
 * @author Brian Carlsen
 * @version 1.0.0
 *
 * Serves as a wrapper to the MINDBODY Sale Service, providing 
 * some additional functionality.
 *
 * All Sale Service methods are available returning
 * 1) An extracted result using the instance method with the same name
 * 2) The raw array response using the instance method with the same name post-fixed with 'Response'.
 * 		The array consists of:
 * 			i) 		The object represtentation of the SOAP response
 * 			ii) 	The raw XML SOAP response
 * 			iii) 	The raw header info of the SOAP response
 */

var Promise = require( 'bluebird' );

var mboService = require( './mbo_Service' );

//--------------- SaleService Class ---------------------

/**
 * Represents the MINDOBDY Sale Service.
 *
 * @constructor
 * @param  {string} username Username of the MINDBODY client interacting with the service.
 * @param  {string} password Password of the MINDBODY client interacting with the service.
 * @return {mbo_SaleService}          Returns the Sale Service.
 */
function mbo_SaleService( username, password ) {
	mboService.call( this, 'SaleService', username, password );
}
mbo_SaleService.prototype = Object.create( mboService.prototype );
mbo_SaleService.prototype.constructor = mbo_SaleService;


module.exports = mbo_SaleService;