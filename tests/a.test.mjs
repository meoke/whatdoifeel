import test from 'tape';
import '../src/js/ReliefTracker'

test('calcRelief', function (t) {
    t.plan(1);

    m = new ReliefTracker(10);
    expectedRelief = 0;
    actualRelief = m.calculateRelief();
    t.equal(actualRelief, expectedRelief);
});