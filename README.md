## Testing asynchronous code in AngularJS using Jasmine (without using mocks)

You might imagine that this test would pass:

```
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
```

Using a stock AngularJS + Jasmine setup, this would fail with the `Async callback was not invoked within timeout specified by jasmine` error.

Why?  It's because the `done()` function is never invoked due to the face that ngMock (which is loaded by default by angular-mocks.js) has taken the liberty of injecting helpers to queue up our deferred functions calls to be applied on flush.  This is great when we're testing code that consume async services that we're mocking, but if we actually want to test the async code itself (like above), we could do without the help.

One way around this, without resorting to wrapping all `resolve()` calls in $scope.apply(), is to opt out of ngMock's test helpers in the test setup like this:

```
beforeEach(function() {
    var $injector = angular.injector(['ng']);
});
```

This sets up our injector to use the normal ng module instead of the 'ngMock with helpers injected.  Specifically, it's the mock version of Angular's $browser and it's defer implementation that's the culprit.  Note that it's still fine if angular-mocks.js is loaded.

