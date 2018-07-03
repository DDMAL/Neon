import {ViewBox} from "../src/ZoomHandler.js";

test("Check 'isUnset', 'set' functions", () => {
    let viewBox = new ViewBox();
    expect(viewBox.isUnset()).toBe(true);
    viewBox.set(0, 0, 30, 30);
    expect(viewBox.isUnset()).toBe(false);
});

test("Check 'get' function", () => {
    let viewBox = new ViewBox();
    viewBox.set(0, 0, 100, 100);
    expect(viewBox.get()).toBe("0 0 100 100");
});

test("Check 'translate' function", () => {
    let viewBox = new ViewBox();
    viewBox.set(0, 0, 100, 100);
    viewBox.translate(25, 35);
    expect(viewBox.a).toBe(25);
    expect(viewBox.b).toBe(35);
    expect(viewBox.c).toBe(100);
    expect(viewBox.d).toBe(100);
});

test("Check 'zoomTo' function", () => {
    let viewBox = new ViewBox();
    viewBox.set(0, 0, 0, 0);
    viewBox.zoomTo(2, 100, 200);
    expect(viewBox.c).toBe(50);
    expect(viewBox.d).toBe(100);
});
