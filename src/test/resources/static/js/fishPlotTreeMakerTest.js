/**
 * Created by xiuchengquek on 29/06/15.
 */



describe('Testing Algorithim', function(){

    var doubleError;
    var singleError;
    var noError;
    var trimmedSingleError;
    var fishPlotTreeMaker;
    var trimmedDoubleError, recurseDoubleError, recurseDoubleErrorSameMut, recurseDoubleErrorSameMutDifftp;


    var $provider;

    beforeEach(module('kingFisherApp'));


    beforeEach(inject(function(_fishPlotFactory_){

        fishPlotTreeMaker = _fishPlotFactory_
        fishPlotTreeMaker = fishPlotTreeMaker.fishPlotTreeMaker;

        singleError = {'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 4 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};


        doubleError = {'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 4 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 6 },{'mut' : 3, 'score' : 2 }]};

        noError  = {'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};

        trimmedSingleError = { 'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};

        trimmedDoubleError = { 'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 3, 'score' : 2 }]};
        // mut 1 in time point A is beigger than mutation 2 and 3
        recurseDoubleError = { 'A'  : [{'mut' : 1, 'score' : 5 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 1 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};

        // mut 1 in time point A is beigger than mutation 2 and 3
        recurseDoubleErrorSameMut = { 'A'  : [{'mut' : 1, 'score' : 5 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 1 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};


        recurseDoubleErrorSameMutDifftp = { 'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 1 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 4 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};


        recurseDoubleErrorSameMut = { 'A'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 1 },
                                                {'mut' : 4, 'score' : 1 },{'mut' : 5, 'score' : 2 },{'mut' : 3, 'score' : 1 }],
            'B' : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 4 },{'mut' : 3, 'score' : 2 }],
            'C'  : [{'mut' : 1, 'score' : 1 },{'mut' : 2, 'score' : 2 },{'mut' : 3, 'score' : 2 }]};




    }));



    it('test that noError Gives no Array', function(){
        expect(fishPlotTreeMaker.checkBranches(noError).length).toBe(0)

    })


    it('test that Single/Multiple Error is detected', function(){
        expect(fishPlotTreeMaker.checkBranches(singleError).length).toBe(1);
        expect(fishPlotTreeMaker.checkBranches(singleError)[0].mut).toBe(2);
        expect(fishPlotTreeMaker.checkBranches(singleError)[0].timePoint).toBe('B');
        expect(fishPlotTreeMaker.checkBranches(doubleError).length).toBe(2);
        expect(fishPlotTreeMaker.checkBranches(doubleError)[0].mut).toBe(2);
        expect(fishPlotTreeMaker.checkBranches(doubleError)[0].timePoint).toBe('B');
        expect(fishPlotTreeMaker.checkBranches(doubleError)[1].mut).toBe(2);
        expect(fishPlotTreeMaker.checkBranches(doubleError)[1].timePoint).toBe('C');
    })

    it('check that remove branches works', function(){

        var singleBranch = fishPlotTreeMaker.checkBranches(singleError);
        var doubleBranch = fishPlotTreeMaker.checkBranches(doubleError);

        expect(fishPlotTreeMaker.removeDamaged(singleError, singleBranch)).toEqual(trimmedSingleError)
        expect(fishPlotTreeMaker.removeDamaged(doubleError, doubleBranch)).toEqual(trimmedDoubleError)



    })

    it('check to make sure that branches are not deleted if there is no error', function(){

        var noBranch = fishPlotTreeMaker.checkBranches(noError);
        expect(fishPlotTreeMaker.removeDamaged(noError, noBranch)).toEqual(noError);


    })
    it('check if recurse trimming works', function(){

        var results = fishPlotTreeMaker.recursiveTrimmed(recurseDoubleError, []);
        var keys = Object.keys(results)

        console.log('thisis', results)
        expect(keys.length).toBe(2);
        expect(keys).toEqual(['1','2']);
        expect(results['1'].timePoint).toEqual('A');
        expect(results['2'].timePoint).toEqual('A');

        var results = fishPlotTreeMaker.recursiveTrimmed(recurseDoubleError, []);
        var keys = Object.keys(results)

        console.log('thisis', results)
        expect(keys.length).toBe(2);
        expect(keys).toEqual(['1','2']);
        expect(results['1'].timePoint).toEqual('A');
        expect(results['2'].timePoint).toEqual('A');




        results = fishPlotTreeMaker.recursiveTrimmed(recurseDoubleErrorSameMut, [])
        console.log(results)
        var keys = Object.keys(results)
        expect(keys.length).toBe(1);
        expect(results['2'].timePoint).toEqual('A');
        expect(results['2'].conflict).toBe(3)



    })




})
















