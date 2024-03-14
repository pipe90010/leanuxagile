const placeCard = require("js/index.js");

test("Function of placing a card in spring backlog", () => {
    var result ={ message: 'Writing your first hyphotesis!! you have been awarded', display:'success', timer:3500};
    expect(placeCard("Hypothesis")).toBe(result);
});