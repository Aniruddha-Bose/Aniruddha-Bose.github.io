// Blog article data, shared by the blog page (blog/blog.js) and the home page highlights.
// To add an article: create its HTML page in blog/ and add an entry below, with a
// `section` of 'Science', 'Projects' or 'Stories'. URLs and images are relative to blog/.

var ARTICLES = [
  {
    url: 'noteable.html',
    section: 'Projects',
    category: 'Accessibility',
    title: 'Building NoteAble: A Study App That Adapts to Dyslexic Learners',
    excerpt:
      'Our entry for Samsung Solve for Tomorrow 2026: a note-taking web app that reads aloud, forgives spelling, and lets every learner choose how their notes look.',
    image: '../assets/img/noteable.png',
    tags: ['Accessibility', 'Web App', 'JavaScript', 'Firebase', 'AI'],
    published: '2026-11-05',
    date: 'November 5, 2026',
    readTime: '7 min read',
  },
  {
    url: 'spooky-pumpkin.html',
    section: 'Projects',
    category: 'Robotics',
    title: 'Spooky Pumpkin: My Entry for the Playto Labs Robo Halloween Challenge 2026',
    excerpt:
      'A paper pumpkin with an IR sensor inside. When someone walks by, its green LED eyes light up and it cackles at them, with Python, PySerial and Pygame handling the sound.',
    image: '../assets/img/spooky-pumpkin.jpg',
    tags: ['Robotics', 'Electronics', 'Python', 'Coding', 'Halloween'],
    published: '2026-11-01',
    date: 'November 1, 2026',
    readTime: '4 min read',
  },
  {
    url: 'fly-connectome.html',
    section: 'Science',
    category: 'Neuroscience',
    title: '166,000 Neurons, 125 Million Connections: Mapping a Fly’s Brain with AI',
    excerpt:
      'Scientists have mapped every neuron and connection in an adult male fruit fly’s brain and nerve cord, and AI did a lot of the work. This is how they did it and why I think it’s a big deal.',
    image: 'https://www.genengnews.com/wp-content/uploads/2024/10/Low-Res_fw_50_L.jpg',
    tags: ['Neuroscience', 'AI', 'Biology', 'Connectomics'],
    published: '2026-09-26',
    date: 'September 26, 2026',
    readTime: '8 min read',
  },
  {
    url: 'pixelrift.html',
    section: 'Projects',
    category: 'Game Dev',
    title: 'PixelRift: Building My Own Indie Game from Scratch',
    excerpt:
      'My 2D pixel-art platformer, made in Python and Pygame, where every few levels throw something new at you. How I built it, from the gameplay and levels to player accounts and getting it onto Steam.',
    image: '../assets/img/pixelrift.jpg',
    tags: ['Game Dev', 'Python', 'Pygame', 'Coding', 'Pixel Art'],
    published: '2026-09-26',
    date: 'September 26, 2026',
    readTime: '7 min read',
  },
  {
    url: 'elarion.html',
    section: 'Stories',
    category: 'Fiction',
    title: 'The Shadow of Elarion',
    excerpt:
      'A fantasy story I wrote as my entry for Writathon 11.0 in Singapore. It’s 18 illustrated pages long, and you can read it here in a page-flip reader.',
    image: '../assets/book/elarion/page-01.jpg',
    tags: ['Fiction', 'Fantasy', 'Short Story', 'Writing'],
    published: '2026-07-11',
    date: 'July 2026',
    readTime: '18 pages',
  },
  {
    url: 'black-holes.html',
    section: 'Science',
    category: 'Black Holes',
    title: 'Black Holes: Where the Universe Breaks Its Own Rules',
    excerpt:
      'What happens when gravity wins? A black hole bends spacetime so hard that nothing gets out, not even light. Here’s the actual science behind them, with real telescope images.',
    image: 'https://cdn.eso.org/images/screen/eso1907a.jpg',
    tags: ['Black Holes', 'Stellar Physics', 'General Relativity'],
    published: '2026-03-01',
    date: 'March 1, 2026',
    readTime: '7 min read',
  },
  {
    url: 'minimalia.html',
    section: 'Projects',
    category: 'Coding',
    title: 'Minimalia: A Minimalist Web Browser',
    excerpt:
      'A desktop browser I built in Python because I wanted the web without all the clutter. What I took out, what I kept, and how it works under the hood.',
    image: '../assets/img/minimalia.png',
    tags: ['Coding', 'Python', 'App Development', 'Minimalism'],
    published: '2026-07-11',
    date: 'July 11, 2026',
    readTime: '6 min read',
  },
];
