/**
 * Created by xiuchengquek on 11/06/15.
 */



describe('kingFisher Post', function() {


    beforeEach(module("dataFactory"));

    var $q;
    var $httpBackend;
    var mock_data;
    var sharedDataService;
    var mock_vaf;

    beforeEach(inject(function($injector) {


        mock_vaf = ["mutation\ttp1\ttp2\tp3",
                    "tp53\t0.1\t0.2\0.3",
                    "AKT1\t0.4\t0.5\0.6"];
        mock_vaf = mock_vaf.join('\n');

        mock_data = {'vaf': mock_vaf};
        sharedDataService = $injector.get("kingFisherData");
        $httpBackend = $injector.get("$httpBackend");
        $httpBackend.whenPOST("/rest", mock_data ).respond(201, mock_data);


    }));

        it('Testing dataFactory.postData ' +
            'make a post call to /rest will return same data if sucesss', function(){


            var promise = sharedDataService.postData(mock_data),
                results;

            promise.then( function (data){
                results = data;
            });

            $httpBackend.flush();
            expect(results.vaf).toBe(mock_data.vaf)
        })

        it('Testing dataFactory.')



    });


