var serviceFactory 		= require( '../lib/mbo_ServiceFactory.js' ),
	soap 				= require( 'soap' ),
	Promise 			= require( 'bluebird' ),
	should 				= require( 'should' ),
	log 				= require( 'fancy-log' );

var service,
	functionNames;

var SOURCE_NAME 		= process.env.mbo_source_name,
	SOURCE_PASSWORD 	= process.env.mbo_source_pass,
	USER_NAME 			= process.env.mbo_user_name,
	USER_PASSWORD 		= process.env.mbo_user_pass,
	SITE_ID 			= process.env.mbo_site_id;

describe( 'MBO Class Service Unit Tests:', function() {

	before( function( done ) {
		serviceFactory.setSourceCredentials( SOURCE_NAME, SOURCE_PASSWORD );
		done();
	} );

	before( function( done ) {
		// Get WSDL description
		soap.createClientAsync( 'https://api.mindbodyonline.com/0_5/ClassService.asmx?wsdl' )
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
		service = serviceFactory.createClassService( USER_NAME, USER_PASSWORD, SITE_ID );

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
					return name + 'Response';
				} );

				service.should.have.properties( respNames );
				done();
		} );
	} );

	describe( 'Custom functions', function() {

		describe( 'Get Class Attendees function', function() {

			it( 'Should have a method #getClassAttendees', function( done ) {
				service.should.have.property( 'getClassAttendees' );
				done();
			} );

			it( 'Should return a Promise passed an Array', function( done, reject ) {
				service.GetClasses()
					.then( function( classes ) {
						return classes[ 0 ].ID;
					} )
					.then( function( id ) {
						return service.getClassAttendees( id );
					} )
					.then( function( attendees ) {
						attendees.should.be.an.Array;
						done();
					} )
					.catch( function( err ) { 
						throw err;
					} );
			} );

		} );
	} );
} );