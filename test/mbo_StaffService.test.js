var serviceFactory = require( '../lib/mbo_ServiceFactory.js' ),
	soap = require( 'soap' ),
	Promise = require( 'bluebird' ),
	should = require( 'should' );

var service,
	functionNames;

var SOURCE_NAME = 'MBOReports',
	SOURCE_PASSWORD = '2imT8ldj48KsOfXppxppGc0Dk7U=',
	USER_NAME = 'Siteowner',
	USER_PASSWORD = 'apitest1234',
	SITE_ID = -99;

Promise.promisifyAll( soap );

describe( 'MBO Staff Service Unit Tests:', function() {

	before( function( done ) {
		serviceFactory.setSourceCredentials( SOURCE_NAME, SOURCE_PASSWORD );
		done();
	} )

	before( function( done ) {
		// Get WSDL description
		soap.createClientAsync( 'https://api.mindbodyonline.com/0_5/StaffService.asmx?wsdl' )
			.then( function( client ) {
				Promise.promisifyAll( client );
				var description = client.describe();

				// For each method in WSDL check the service has a matcing funciton
				// and one with 'Response' appended
				functionNames = [];
				for ( var svc in description ) { 
					for ( var port in description[ svc ] ) {
						for ( var fcn in description[ svc ][ port ] ) {
							functionNames.push( fcn );
						}
					}
				}

				done();
			} )
			.catch( function( err ) {
				throw err;
			} );
	} );

	beforeEach( function( done ) {
		service = serviceFactory.createStaffService( USER_NAME, USER_PASSWORD, SITE_ID );

		service.on( 'ready', function() {
			done();
		} );
	} );

	describe( 'Function creation from the WSDL', function() {

		it( 'Should have instance methods matching those of the WSDL', function( done ) {
				service.should.have.properties( functionNames );
				done();
		} );

		it( 'Should have instance methods matching those of the WSDL with "Response" appended', function( done ) {
				respNames = functionNames.map( function( name ) {
					return name + "Response";
				} );

				service.should.have.properties( respNames );
				done();
		} );
	} );

	describe( 'Custom functions', function() {
		
	} );
} );