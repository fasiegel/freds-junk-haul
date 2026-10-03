import { NODES } from "./twenty";

export type Topic = {
  id: string;
  text: string;
  yesLabel?: string;
  noLabel?: string;
};

const BROAD: Topic[] = [
  { id: "pile", text: "Is it a pile of stuff, not one single thing?", yesLabel: "A pile", noLabel: "One thing" },
  { id: "carry", text: "Could one person carry it out the door?" },
  { id: "sit", text: "Do you sit or sleep on it?" },
  { id: "plug", text: "Does it plug in, run on gas, or hold water?" },
  { id: "kitchen", text: "Does it live in the kitchen?" },
  { id: "bath", text: "Is it in the bathroom?" },
  { id: "wood", text: "Is it mostly wooden furniture?" },
  { id: "outside", text: "Is it outdoor junk — yard, patio, pool, shed, or a hoop?" },
  { id: "remodel", text: "Is it from a remodel — drywall, carpet, tile, or lumber?" },
  { id: "metal", text: "Is it mostly metal?" },
];

const SPECIFIC: Topic[] = [
  { id: "tv", text: "Is it a TV?" },
  { id: "tires", text: "Is it tires?" },
  { id: "grill", text: "Is it a grill or a smoker?" },
  { id: "bed", text: "Is it a mattress or a bed frame?" },
  { id: "couch", text: "Is it a couch or a sectional?" },
  { id: "corner", text: "Does it turn a corner or come apart in pieces?" },
  { id: "cold", text: "Does it keep food cold?" },
  { id: "tall", text: "Is it about as tall as a person?" },
  { id: "lid", text: "Does the lid open from the top?" },
  { id: "laundry", text: "Is it a washer or a dryer?" },
  { id: "heater", text: "Is it a water heater?" },
  { id: "gym", text: "Is it exercise equipment?" },
  { id: "hottub", text: "Is it a hot tub?" },
  { id: "toilet", text: "Is it a toilet?" },
  { id: "piano", text: "Is it a piano?" },
  { id: "safe", text: "Is it a safe?" },
  { id: "boxes", text: "Is it boxes from a move?" },
];

const YES: Record<string, string[]> = {
  "g-cleanout": ["pile"],
  "g-boxes": ["pile", "boxes"],
  "g-yard": ["pile", "outside"],
  "g-build": ["pile", "remodel"],
  "g-clutter": ["pile"],
  "g-mixed": ["pile"],
  "g-tv": ["carry", "plug", "tv"],
  "g-ewaste": ["carry", "plug"],
  "g-small-app": ["carry", "plug"],
  "g-tires": ["tires"],
  "g-grill": ["carry", "grill"],
  "g-bags": ["carry", "pile"],
  "g-small": ["carry"],
  "g-mattress": ["sit", "bed"],
  "g-frame": ["sit", "bed", "wood"],
  "g-sectional": ["sit", "couch", "corner"],
  "g-couch": ["sit", "couch"],
  "g-recliner": ["sit"],
  "g-patio": ["sit", "outside"],
  "g-chair": ["sit"],
  "g-fridge": ["plug", "kitchen", "cold", "tall"],
  "g-chest": ["plug", "kitchen", "cold", "lid"],
  "g-mini": ["carry", "plug", "kitchen", "cold"],
  "g-stove": ["plug", "kitchen"],
  "g-dish": ["plug", "kitchen"],
  "g-kitchen": ["plug", "kitchen"],
  "g-washer": ["plug", "laundry"],
  "g-heater": ["plug", "heater"],
  "g-gym": ["gym"],
  "g-hottub": ["plug", "hottub", "outside"],
  "g-machine": ["plug"],
  "g-toilet": ["bath", "toilet"],
  "g-bath": ["bath"],
  "g-vanity": ["bath", "wood"],
  "g-dresser": ["wood"],
  "g-desk": ["wood"],
  "g-piano": ["wood", "piano"],
  "g-pool-table": ["wood"],
  "g-wood": ["wood"],
  "g-safe": ["metal", "safe"],
  "g-hoop": ["metal", "outside"],
  "g-scrap": ["metal"],
  "g-carpet": ["remodel"],
  "g-pool": ["outside"],
  "g-shed": ["outside"],
  "g-bulky": [],
};

export type TopicItem = { id: string; item: string; detail: string; yes: string[] };

export const TOPIC_ITEMS: TopicItem[] = Object.entries(YES).map(([id, yes]) => {
  const node = NODES[id];
  if (!node || node.kind !== "guess") throw new Error(`Missing guess ${id}`);
  return { id, item: node.item, detail: node.detail, yes };
});

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = swap;
  }
  return copy;
}

/** Six broad topics plus four specific ones, then shuffled. */
export function dealTopics(): Topic[] {
  return shuffle([...shuffle(BROAD).slice(0, 6), ...shuffle(SPECIFIC).slice(0, 4)]);
}

export function rankTopics(
  answers: { id: string; yes: boolean }[],
  skip: string[],
): TopicItem[] {
  return TOPIC_ITEMS.filter((item) => !skip.includes(item.id))
    .map((item) => ({
      item,
      score: answers.reduce((sum, answer) => sum + (item.yes.includes(answer.id) === answer.yes ? 1 : -1), 0),
    }))
    .sort((a, b) => b.score - a.score || a.item.item.localeCompare(b.item.item))
    .map((row) => row.item);
}
