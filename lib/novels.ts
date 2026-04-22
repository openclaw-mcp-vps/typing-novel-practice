export interface Passage {
  id: string;
  title: string;
  text: string;
}

export interface Chapter {
  number: number;
  title: string;
  passages: Passage[];
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  hook: string;
  chapters: Chapter[];
}

export const novels: Novel[] = [
  {
    id: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    hook: "Crisp dialogue and quick wit for rhythm and punctuation control.",
    chapters: [
      {
        number: 1,
        title: "A Truth Universally Acknowledged",
        passages: [
          {
            id: "pp-1-1",
            title: "Opening Line",
            text:
              "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
          },
          {
            id: "pp-1-2",
            title: "Mrs. Bennet's Urgency",
            text:
              "My dear Mr. Bennet, have you heard that Netherfield Park is let at last? She spoke with lively impatience, as if the future of every daughter depended on the answer.",
          },
        ],
      },
      {
        number: 2,
        title: "Netherfield Arrivals",
        passages: [
          {
            id: "pp-2-1",
            title: "The Ball and First Impressions",
            text:
              "Mr. Darcy soon drew the attention of the room by his fine, tall person, handsome features, noble mien; and yet his manners gave a disgust which turned the tide of his popularity.",
          },
          {
            id: "pp-2-2",
            title: "Elizabeth's Reading of Character",
            text:
              "She had a lively, playful disposition, which delighted in anything ridiculous. A confident tone, unsupported by generosity, never escaped her notice.",
          },
        ],
      },
      {
        number: 3,
        title: "Letters and Realizations",
        passages: [
          {
            id: "pp-3-1",
            title: "A Changed Perspective",
            text:
              "Till this moment, I never knew myself. Her pride had been wounded, but her judgment had also been corrected, and she read every sentence with renewed attention.",
          },
          {
            id: "pp-3-2",
            title: "Measured Reflection",
            text:
              "Vanity, not love, has been my folly. I have courted prepossession and ignorance, and driven reason away where either were concerned.",
          },
        ],
      },
    ],
  },
  {
    id: "moby-dick",
    title: "Moby-Dick",
    author: "Herman Melville",
    hook: "Long cadences that build endurance and concentration.",
    chapters: [
      {
        number: 1,
        title: "Loomings",
        passages: [
          {
            id: "md-1-1",
            title: "Call Me Ishmael",
            text:
              "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, I thought I would sail about a little and see the watery part of the world.",
          },
          {
            id: "md-1-2",
            title: "A Restless Mind",
            text:
              "Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul, then I account it high time to get to sea as soon as I can.",
          },
        ],
      },
      {
        number: 2,
        title: "The Spouter-Inn",
        passages: [
          {
            id: "md-2-1",
            title: "Night Quarters",
            text:
              "A curious little deformed old house, smelling of old oil and sea salt, stood with a weather-beaten sign as if every gale in the Atlantic had written on it.",
          },
          {
            id: "md-2-2",
            title: "Unexpected Company",
            text:
              "Better sleep with a sober cannibal than a drunken Christian. The thought came like a practical rule, not a joke, in that unsettled room.",
          },
        ],
      },
      {
        number: 3,
        title: "The Quarter-Deck",
        passages: [
          {
            id: "md-3-1",
            title: "Ahab's Oath",
            text:
              "Talk not to me of blasphemy, man; I would strike the sun if it insulted me. The crew felt the force of his will before they understood his words.",
          },
          {
            id: "md-3-2",
            title: "A Singular Resolve",
            text:
              "All visible objects are but as pasteboard masks. If man will strike, strike through the mask. There was no room in him for half measures.",
          },
        ],
      },
    ],
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    hook: "Tense journal prose that sharpens consistency under pressure.",
    chapters: [
      {
        number: 1,
        title: "Jonathan Harker's Journal",
        passages: [
          {
            id: "dr-1-1",
            title: "Arrival in Transylvania",
            text:
              "As the evening fell, the shadows of the great mountains grew deeper and darker, and the coach seemed to drive straight into a wall of night.",
          },
          {
            id: "dr-1-2",
            title: "At the Castle Door",
            text:
              "A tall old man, clean shaven save for a long white moustache, stood in the doorway and held out his hand with a courtly gesture.",
          },
        ],
      },
      {
        number: 2,
        title: "The Count's House",
        passages: [
          {
            id: "dr-2-1",
            title: "No Reflection",
            text:
              "This time there could be no error, for the man was close to me, and I could see him over my shoulder. But there was no reflection of him in the mirror.",
          },
          {
            id: "dr-2-2",
            title: "Locked In",
            text:
              "The castle is a veritable prison, and I am a prisoner. The words felt calm on the page, yet my hand shook as I wrote them.",
          },
        ],
      },
      {
        number: 3,
        title: "Mina's Notes",
        passages: [
          {
            id: "dr-3-1",
            title: "Gathering Evidence",
            text:
              "We must keep writing everything down exactly as it happened, for memory grows uncertain when fear has had its say.",
          },
          {
            id: "dr-3-2",
            title: "Resolve",
            text:
              "Our work is not done by courage alone. We need accuracy, patience, and one clear account that every one of us can trust.",
          },
        ],
      },
    ],
  },
];

export function getNovelById(novelId: string): Novel | undefined {
  return novels.find((novel) => novel.id === novelId);
}

export function getChapter(novelId: string, chapterNumber: number): Chapter | undefined {
  return getNovelById(novelId)?.chapters.find(
    (chapter) => chapter.number === chapterNumber,
  );
}
