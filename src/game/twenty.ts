export type Ask = {
  kind: "ask";
  text: string;
  yes: string;
  no: string;
  yesLabel?: string;
  noLabel?: string;
};

export type Guess = {
  kind: "guess";
  item: string;
  detail: string;
  wrong: string;
};

export type Node = Ask | Guess;

export const START = "start";

export const NODES: Record<string, Node> = {
  start: {
    kind: "ask",
    text: "Is it one thing, or a pile of stuff?",
    yes: "one",
    no: "pile",
    yesLabel: "One thing",
    noLabel: "A pile",
  },
  pile: {
    kind: "ask",
    text: "Is it a whole room, garage, attic, or house that needs clearing?",
    yes: "g-cleanout",
    no: "pile-boxes",
  },
  "g-cleanout": {
    kind: "guess",
    item: "House or garage cleanout",
    detail: "A mixed load. Fred brings the truck and empties the space, not one piece at a time.",
    wrong: "pile-boxes",
  },
  "pile-boxes": {
    kind: "ask",
    text: "Is most of it boxes from a move?",
    yes: "g-boxes",
    no: "pile-yard",
  },
  "g-boxes": {
    kind: "guess",
    item: "Moving boxes",
    detail: "Cardboard and packed leftovers. They stack in the truck and go in one trip.",
    wrong: "pile-yard",
  },
  "pile-yard": {
    kind: "ask",
    text: "Is it yard waste — branches, brush, dirt, or bags of green waste?",
    yes: "g-yard",
    no: "pile-build",
  },
  "g-yard": {
    kind: "guess",
    item: "Yard waste",
    detail: "Brush, branches, and bagged green waste. Not regular household trash.",
    wrong: "pile-build",
  },
  "pile-build": {
    kind: "ask",
    text: "Is it from a remodel — drywall, lumber, tile, cabinets, or roofing?",
    yes: "g-build",
    no: "pile-clutter",
  },
  "g-build": {
    kind: "guess",
    item: "Construction debris",
    detail: "Remodel rubble. Heavy, dusty, and a different load from furniture.",
    wrong: "pile-clutter",
  },
  "pile-clutter": {
    kind: "ask",
    text: "Is it mostly clothes, toys, and everyday household clutter?",
    yes: "g-clutter",
    no: "g-mixed",
  },
  "g-clutter": {
    kind: "guess",
    item: "Household clutter",
    detail: "Bags of clothes, toys, and odds and ends. Light, but it fills a truck.",
    wrong: "g-mixed",
  },
  "g-mixed": {
    kind: "guess",
    item: "Mixed junk load",
    detail: "A bit of everything. Fred treats it as one haul, not a single item.",
    wrong: "stump",
  },
  one: {
    kind: "ask",
    text: "Could one person carry it out the door?",
    yes: "light",
    no: "heavy",
  },
  light: {
    kind: "ask",
    text: "Does it plug in, or does it have a screen?",
    yes: "light-plug",
    no: "light-tire",
  },
  "light-plug": {
    kind: "ask",
    text: "Is it a TV?",
    yes: "g-tv",
    no: "light-ewaste",
  },
  "g-tv": {
    kind: "guess",
    item: "Old TV",
    detail: "A television. Screens are e-waste, even the heavy old ones.",
    wrong: "light-ewaste",
  },
  "light-ewaste": {
    kind: "ask",
    text: "Is it a computer, printer, or other electronics?",
    yes: "g-ewaste",
    no: "g-small-app",
  },
  "g-ewaste": {
    kind: "guess",
    item: "Electronics",
    detail: "Computers, printers, and small screens. They should not go in the regular trash.",
    wrong: "g-small-app",
  },
  "g-small-app": {
    kind: "guess",
    item: "Small appliance",
    detail: "Something like a microwave, vacuum, or fan. One person can lift it.",
    wrong: "light-tire",
  },
  "light-tire": {
    kind: "ask",
    text: "Is it a tire, or a set of tires?",
    yes: "g-tires",
    no: "light-grill",
  },
  "g-tires": {
    kind: "guess",
    item: "Tires",
    detail: "Tires, with or without rims. They don't belong in a dumpster.",
    wrong: "light-grill",
  },
  "light-grill": {
    kind: "ask",
    text: "Is it a grill or a smoker?",
    yes: "g-grill",
    no: "light-bags",
  },
  "g-grill": {
    kind: "guess",
    item: "BBQ grill",
    detail: "A grill or smoker. Propane tanks have to be empty before they ride.",
    wrong: "light-bags",
  },
  "light-bags": {
    kind: "ask",
    text: "Is it bags of clothes, books, or household junk?",
    yes: "g-bags",
    no: "g-small",
  },
  "g-bags": {
    kind: "guess",
    item: "Bagged household junk",
    detail: "Bags and loose small stuff. Easy to load, bulky once it adds up.",
    wrong: "g-small",
  },
  "g-small": {
    kind: "guess",
    item: "Small household item",
    detail: "One light piece that isn't electronics, tires, or a grill.",
    wrong: "stump",
  },
  heavy: {
    kind: "ask",
    text: "Do you sit or sleep on it?",
    yes: "seat",
    no: "heavy-tire",
  },
  seat: {
    kind: "ask",
    text: "Is it a bed — mattress, box spring, or frame?",
    yes: "bed",
    no: "couch-q",
  },
  bed: {
    kind: "ask",
    text: "Is the mattress the piece that has to go?",
    yes: "g-mattress",
    no: "g-frame",
  },
  "g-mattress": {
    kind: "guess",
    item: "Mattress",
    detail: "A mattress or box spring. It bends, but it takes two people and a truck.",
    wrong: "g-frame",
  },
  "g-frame": {
    kind: "guess",
    item: "Bed frame",
    detail: "The frame, headboard, or rails — not the mattress itself.",
    wrong: "couch-q",
  },
  "couch-q": {
    kind: "ask",
    text: "Is it a couch or a sectional?",
    yes: "sectional-q",
    no: "recliner-q",
  },
  "sectional-q": {
    kind: "ask",
    text: "Does it turn a corner, or split into pieces?",
    yes: "g-sectional",
    no: "g-couch",
  },
  "g-sectional": {
    kind: "guess",
    item: "Sectional sofa",
    detail: "A sectional. The pieces come apart, and it still fills a lot of the truck.",
    wrong: "g-couch",
  },
  "g-couch": {
    kind: "guess",
    item: "Couch",
    detail: "A sofa. Too big for the curb, and the usual thing Fred is called for.",
    wrong: "recliner-q",
  },
  "recliner-q": {
    kind: "ask",
    text: "Is it a recliner or an overstuffed chair?",
    yes: "g-recliner",
    no: "patio-q",
  },
  "g-recliner": {
    kind: "guess",
    item: "Recliner",
    detail: "A recliner or big stuffed chair. Heavy for its size, especially the powered ones.",
    wrong: "patio-q",
  },
  "patio-q": {
    kind: "ask",
    text: "Is it outdoor patio furniture?",
    yes: "g-patio",
    no: "g-chair",
  },
  "g-patio": {
    kind: "guess",
    item: "Patio furniture",
    detail: "Chairs, a table, or a whole outdoor set.",
    wrong: "g-chair",
  },
  "g-chair": {
    kind: "guess",
    item: "Upholstered chair",
    detail: "A chair you sit in that isn't a couch, recliner, or patio set.",
    wrong: "stump",
  },
  "heavy-tire": {
    kind: "ask",
    text: "Is it tires?",
    yes: "g-tires",
    no: "machine-q",
  },
  "machine-q": {
    kind: "ask",
    text: "Does it plug in, run on gas, or hold water?",
    yes: "kitchen-q",
    no: "bath-q",
  },
  "kitchen-q": {
    kind: "ask",
    text: "Does it live in the kitchen?",
    yes: "cold-q",
    no: "laundry-q",
  },
  "cold-q": {
    kind: "ask",
    text: "Does it keep food cold?",
    yes: "tall-q",
    no: "stove-q",
  },
  "tall-q": {
    kind: "ask",
    text: "Is it about as tall as a person?",
    yes: "g-fridge",
    no: "chest-q",
  },
  "g-fridge": {
    kind: "guess",
    item: "Refrigerator",
    detail: "A full-size fridge. Heavy, and the doors should be taped or taken off.",
    wrong: "chest-q",
  },
  "chest-q": {
    kind: "ask",
    text: "Does the lid open from the top?",
    yes: "g-chest",
    no: "g-mini",
  },
  "g-chest": {
    kind: "guess",
    item: "Chest freezer",
    detail: "A top-opening freezer. Awkward to tip, and it stays cold a long time.",
    wrong: "g-mini",
  },
  "g-mini": {
    kind: "guess",
    item: "Mini fridge",
    detail: "A small refrigerator. Lighter than a full-size, still an appliance.",
    wrong: "stove-q",
  },
  "stove-q": {
    kind: "ask",
    text: "Is it a stove or an oven?",
    yes: "g-stove",
    no: "dish-q",
  },
  "g-stove": {
    kind: "guess",
    item: "Stove",
    detail: "A range or wall oven. Gas lines have to be off before it moves.",
    wrong: "dish-q",
  },
  "dish-q": {
    kind: "ask",
    text: "Is it a dishwasher?",
    yes: "g-dish",
    no: "g-kitchen",
  },
  "g-dish": {
    kind: "guess",
    item: "Dishwasher",
    detail: "A dishwasher. Usually pulled from under the counter.",
    wrong: "g-kitchen",
  },
  "g-kitchen": {
    kind: "guess",
    item: "Kitchen appliance",
    detail: "A big kitchen piece that isn't a fridge, stove, or dishwasher.",
    wrong: "laundry-q",
  },
  "laundry-q": {
    kind: "ask",
    text: "Is it a washer or a dryer?",
    yes: "g-washer",
    no: "heater-q",
  },
  "g-washer": {
    kind: "guess",
    item: "Washer or dryer",
    detail: "Laundry machines. They look manageable until you try the stairs.",
    wrong: "heater-q",
  },
  "heater-q": {
    kind: "ask",
    text: "Is it a water heater?",
    yes: "g-heater",
    no: "gym-q",
  },
  "g-heater": {
    kind: "guess",
    item: "Water heater",
    detail: "A tank water heater. Drain it first so it isn't a surprise weight.",
    wrong: "gym-q",
  },
  "gym-q": {
    kind: "ask",
    text: "Is it a treadmill, elliptical, or a rack of weights?",
    yes: "g-gym",
    no: "tub-q",
  },
  "g-gym": {
    kind: "guess",
    item: "Exercise equipment",
    detail: "Gym gear. Treadmills come apart, and the weight is in the motor and plates.",
    wrong: "tub-q",
  },
  "tub-q": {
    kind: "ask",
    text: "Is it a hot tub or spa?",
    yes: "g-hottub",
    no: "g-machine",
  },
  "g-hottub": {
    kind: "guess",
    item: "Hot tub",
    detail: "A hot tub. It has to be empty, and it is a crew job, not a one-person carry.",
    wrong: "g-machine",
  },
  "g-machine": {
    kind: "guess",
    item: "Large appliance",
    detail: "A heavy machine that plugs in or holds water, and it isn't one of the usual kitchen or laundry pieces.",
    wrong: "bath-q",
  },
  "bath-q": {
    kind: "ask",
    text: "Is it in the bathroom?",
    yes: "toilet-q",
    no: "wood-q",
  },
  "toilet-q": {
    kind: "ask",
    text: "Is it a toilet?",
    yes: "g-toilet",
    no: "bath-tub-q",
  },
  "g-toilet": {
    kind: "guess",
    item: "Toilet",
    detail: "A toilet. Porcelain, and it needs the water shut off before it comes out.",
    wrong: "bath-tub-q",
  },
  "bath-tub-q": {
    kind: "ask",
    text: "Is it a bathtub or a shower stall?",
    yes: "g-bath",
    no: "g-vanity",
  },
  "g-bath": {
    kind: "guess",
    item: "Bathtub",
    detail: "A tub or shower. Cast iron is a different job from a fiberglass shell.",
    wrong: "g-vanity",
  },
  "g-vanity": {
    kind: "guess",
    item: "Bathroom vanity",
    detail: "A sink cabinet from the bathroom.",
    wrong: "wood-q",
  },
  "wood-q": {
    kind: "ask",
    text: "Is it mostly wooden furniture?",
    yes: "dresser-q",
    no: "metal-q",
  },
  "dresser-q": {
    kind: "ask",
    text: "Does it have drawers for clothes?",
    yes: "g-dresser",
    no: "desk-q",
  },
  "g-dresser": {
    kind: "guess",
    item: "Dresser",
    detail: "A dresser or chest of drawers. Empty the drawers or they become a sled.",
    wrong: "desk-q",
  },
  "desk-q": {
    kind: "ask",
    text: "Is it a desk?",
    yes: "g-desk",
    no: "piano-q",
  },
  "g-desk": {
    kind: "guess",
    item: "Desk",
    detail: "A desk. Office or home, it still goes on the truck as furniture.",
    wrong: "piano-q",
  },
  "piano-q": {
    kind: "ask",
    text: "Is it a piano?",
    yes: "g-piano",
    no: "pool-table-q",
  },
  "g-piano": {
    kind: "guess",
    item: "Piano",
    detail: "A piano. Uprights are a crew and a doorway problem. Grands are worse.",
    wrong: "pool-table-q",
  },
  "pool-table-q": {
    kind: "ask",
    text: "Is it a pool table?",
    yes: "g-pool-table",
    no: "g-wood",
  },
  "g-pool-table": {
    kind: "guess",
    item: "Pool table",
    detail: "A pool table. The slate is the heavy part, and it comes apart.",
    wrong: "g-wood",
  },
  "g-wood": {
    kind: "guess",
    item: "Wooden furniture",
    detail: "A bulky wood piece — cabinet, table, bookshelf, or something like it.",
    wrong: "metal-q",
  },
  "metal-q": {
    kind: "ask",
    text: "Is it mostly metal?",
    yes: "safe-q",
    no: "carpet-q",
  },
  "safe-q": {
    kind: "ask",
    text: "Is it a safe?",
    yes: "g-safe",
    no: "hoop-q",
  },
  "g-safe": {
    kind: "guess",
    item: "Safe",
    detail: "A safe. Small ones lie about their weight. Big ones need a plan and a crew.",
    wrong: "hoop-q",
  },
  "hoop-q": {
    kind: "ask",
    text: "Is it a basketball hoop?",
    yes: "g-hoop",
    no: "g-scrap",
  },
  "g-hoop": {
    kind: "guess",
    item: "Basketball hoop",
    detail: "A hoop and pole. The base is the part that surprises people.",
    wrong: "g-scrap",
  },
  "g-scrap": {
    kind: "guess",
    item: "Scrap metal",
    detail: "Metal that isn't a safe or a hoop — rails, shelving, or a scrap pile.",
    wrong: "carpet-q",
  },
  "carpet-q": {
    kind: "ask",
    text: "Is it carpet, padding, or old flooring?",
    yes: "g-carpet",
    no: "yard-built",
  },
  "g-carpet": {
    kind: "guess",
    item: "Carpet",
    detail: "Carpet and pad. Roll it, or it becomes a dirty cloud in the truck.",
    wrong: "yard-built",
  },
  "yard-built": {
    kind: "ask",
    text: "Is it something built outside, like a pool, shed, or playset?",
    yes: "pool-q",
    no: "g-bulky",
  },
  "pool-q": {
    kind: "ask",
    text: "Does it hold water, like an above-ground pool?",
    yes: "g-pool",
    no: "g-shed",
  },
  "g-pool": {
    kind: "guess",
    item: "Above-ground pool",
    detail: "An above-ground pool. It has to be drained before anyone cuts it down.",
    wrong: "g-shed",
  },
  "g-shed": {
    kind: "guess",
    item: "Shed or playset",
    detail: "A shed, swing set, or playset. It comes apart, then it becomes a lumber load.",
    wrong: "g-bulky",
  },
  "g-bulky": {
    kind: "guess",
    item: "Bulky junk",
    detail: "One heavy piece that doesn't match the usual furniture or appliances.",
    wrong: "stump",
  },
  stump: { kind: "guess", item: "", detail: "", wrong: "stump" },
};

export function isStump(id: string) {
  return id === "stump";
}

export function guessList(): { id: string; item: string }[] {
  const seen = new Set<string>();
  const out: { id: string; item: string }[] = [];
  for (const [id, node] of Object.entries(NODES)) {
    if (node.kind !== "guess" || !node.item || seen.has(node.item)) continue;
    seen.add(node.item);
    out.push({ id, item: node.item });
  }
  return out;
}
