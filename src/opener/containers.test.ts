import { colorFromContainerName } from "./containers";

describe("colorFromContainerName", () => {
    // initially failing due to the hash of this string returning a negative number.
    it("should return a color from the array", () => {
        const color = colorFromContainerName("cf-proda");
        expect(color).toEqual("orange");
    });
});
