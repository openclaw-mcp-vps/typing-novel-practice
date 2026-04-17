export type Chapter = {
  id: string;
  title: string;
  passage: string;
};

export type Novel = {
  id: string;
  title: string;
  author: string;
  blurb: string;
  chapters: Chapter[];
};

export const novels: Novel[] = [
  {
    id: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    blurb: "Sharp dialogue and social wit that keeps your fingers moving.",
    chapters: [
      {
        id: "chapter-1",
        title: "Chapter 1",
        passage:
          "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters."
      },
      {
        id: "chapter-2",
        title: "Chapter 2",
        passage:
          "Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner. Observing his second daughter employed in trimming a hat, he suddenly addressed her with: 'I hope Mr. Bingley will like it, Lizzy.'"
      },
      {
        id: "chapter-3",
        title: "Chapter 3",
        passage:
          "The ladies of Longbourn soon waited on those of Netherfield. The visit was soon returned in due form. Miss Bennet's pleasing manners grew on the goodwill of Mrs. Hurst and Miss Bingley; and though the mother was found to be intolerable, and the younger sisters not worth speaking to, a wish of being better acquainted with them was expressed toward the two eldest."
      }
    ]
  },
  {
    id: "sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    blurb: "Fast-paced deductions for rhythm, precision, and sustained focus.",
    chapters: [
      {
        id: "bohemia-1",
        title: "A Scandal in Bohemia",
        passage:
          "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind."
      },
      {
        id: "bohemia-2",
        title: "A Scandal in Bohemia, Part II",
        passage:
          "I had seen little of Holmes lately. My marriage had drifted us away from each other. But one night, when the wind howled outside and the rain beat fiercely against the windows, Holmes stepped into my room with that quiet, alert expression that told me his mind had seized on a fresh problem worth all his powers."
      },
      {
        id: "league-1",
        title: "The Red-Headed League",
        passage:
          "I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair. With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me."
      }
    ]
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    blurb: "Atmospheric prose that rewards control and endurance.",
    chapters: [
      {
        id: "dracula-1",
        title: "Jonathan Harker's Journal",
        passage:
          "Left Munich at 8:35 p.m. on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible."
      },
      {
        id: "dracula-2",
        title: "The Castle",
        passage:
          "As I write there is in the passage below a sound of many feet and the crash of many voices. I am in a prison, and I can see no way out. The castle is a veritable prison, and I am a prisoner. Yet there are moments when the moonlight on the crags gives the whole scene a beauty so strange that terror and wonder seem to live together in the same breath."
      },
      {
        id: "dracula-3",
        title: "Night Visitors",
        passage:
          "All at once the moonlight was obscured by a great cloud, and in the darkness I heard a strange, low laugh, very sweet and very bitter at the same time. Then there came a rustling at the window, and three figures stood in the room, women by their dress and manner, but with something in their eyes that made my blood run cold."
      }
    ]
  }
];

export function findNovel(novelId: string) {
  return novels.find((novel) => novel.id === novelId) ?? novels[0];
}

export function findChapter(novelId: string, chapterId: string) {
  const novel = findNovel(novelId);
  return novel.chapters.find((chapter) => chapter.id === chapterId) ?? novel.chapters[0];
}
