describe('promise resolution without mocks', function() {
    var $q;

    beforeEach(function() {
        var $injector = angular.injector(['ng']);
        $q = $injector.get('$q');
    });
    
    it('$q promise should resolve', function(done) {
        function doAsync() {
            var d = $q.defer();
            setTimeout(function() {
                d.resolve('resolved');
            }, 1000);
            return d.promise;
        }

        doAsync().then(function success(result) {
            expect(result).toBe('resolved');
        }).catch(function error() {
            expect(false).toBe(true);
        }).finally(function() {
            done();
        });
    });
});
