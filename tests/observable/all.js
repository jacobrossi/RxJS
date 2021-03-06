QUnit.module('All');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('All_Empty', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onNext(250, true), 
    onCompleted(250)
  );
});

test('All_Return', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onNext(250, true), 
    onCompleted(250)
  );
});

test('All_ReturnNotMatch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, -2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onNext(210, false), 
    onCompleted(210)
  );
});

test('All_SomeNoneMatch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, -2), 
    onNext(220, -3), 
    onNext(230, -4), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onNext(210, false), 
    onCompleted(210)
  );
});

test('All_SomeMatch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, -2), 
    onNext(220, 3), 
    onNext(230, -4), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
      return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onNext(210, false), 
    onCompleted(210)
  );
});

test('All_SomeAllMatch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onNext(250, true), 
    onCompleted(250)
  );
});

test('All_Throw', function () {
  var error = new Error();
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, error)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual(
    onError(210, error)
  );
});

test('All_Never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.all(function (x) { return x > 0; });
  });

  results.messages.assertEqual();
});
