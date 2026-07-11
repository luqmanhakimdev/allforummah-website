/** @typedef {{ id: string, title: string, year: number | null, lyrics?: string }} PlaylistVideo */

export const playlist = {
  id: 'PL92BFBBF327B474AF',
  title: 'All For Ummah Nasyid Video Compilation',
  url: 'https://www.youtube.com/playlist?list=PL92BFBBF327B474AF',
};

export const LYRICS_PLACEHOLDER = `[Lyrics coming soon]

Verse 1
—
—

Chorus
—
—

Verse 2
—
—

Chorus
—
—`;

/** Strip shared leading indent so template-string formatting stays left-aligned. */
/** @param {string} text */
export function formatLyrics(text) {
  const trimmed = text.replace(/^\s*\n/, '').replace(/\n\s*$/, '');
  const lines = trimmed.split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent)).join('\n').trim();
}

/** @type {PlaylistVideo[]} */
export const playlistVideos = [
  { id: 'FXatNxM-xFo', title: 'Sejati - All For Ummah', year: null },
  { id: 'XBh_OgXBxZs', title: 'Sentosa (Untuk Gaza) - All For Ummah', year: null },
  { id: 'X1bBbqS319c', title: 'All For Ummah 2004 (intro)', year: 2004 },
  { id: 'VGv5kF0eJxE', title: 'All For Ummah 2004 (impian)', year: 2004 },
  { id: 'AKZQEKbyREQ', title: 'All For Ummah (Seruan Solat)', year: null },
  { id: 'XtX8ieeoVKE', title: 'All For Ummah 2005 Johan Kebangsaan HQ [1/3]', year: 2005 },
  { id: 'Vc5xl6OyDVA', title: 'All For Ummah 2005 Johan Kebangsaan HQ [2/3]', year: 2005 },
  { id: 'piRGAEXaJlI', title: 'All For Ummah 2005 Johan Kebangsaan HQ [3/3]', year: 2005 },
  { id: 'VApjUWNRJrU', title: 'All For Ummah 2006 Johan Nasyid Kebangsaan', year: 2006 },
  {
    id: '2vivTMkzzDI',
    title: 'Naib Johan Festival Nasyid Kebangsaan 2007-Selangor',
    year: 2007,
  },
  {
    id: 'ufdaF3dEdzA',
    title: 'Naib Johan Mahrajan Kebangsaan 2007 - Selangor',
    year: 2007,
  },
  {
    id: 'gmBHSQB9Kqc',
    title: 'All For Ummah 2008 Peringkat Kebangsaan [1/2]',
    year: 2008,
  },
  {
    id: '4mlJ74bwtlY',
    title: 'All For Ummah 2008 Peringkat Kebangsaan [2/2]',
    year: 2008,
  },
  {
    id: '-_FMjiXUACU',
    title: 'All For Ummah 2009 Festival Nasyid Kebangsaan Lagu 1 (Anugerah Lagu Tema Terbaik)',
    year: 2009,
    lyrics: `Sejarah silam menjadi panduan
Mekar mewangi sepanjang zaman
Sejarah silam menjadi panduan
Mekar mewangi sepanjang zaman

Lahirnya utusan
Permata junjungan
Pekerti murni
Jadi Sandaran

Bina kehidupan
Tempuh cabaran
Akhlak mulia
Jadi tauladan`,
  },
  {
    id: 'F6jYjtObBdw',
    title: 'All For Ummah 2009 Festival Nasyid Kebangsaan Lagu 2',
    year: 2009,
  },
  {
    id: 'jE1IazI8rN8',
    title: 'All For Ummah (SMAP Kajang) - Johan Pertandingan Nasyid Piala Rabbani 2010',
    year: 2010,
  },
  {
    id: '-eKeiS_5lLo',
    title: 'Nasyid All For Ummah - Hari Anugerah Kurikulum 2010',
    year: 2010,
  },
  { id: 'oSGIunfR4f8', title: 'All For Ummah JOHAN peringkat zon 2011', year: 2011 },
  {
    id: 'w7u8bvXdtDg',
    title: 'Festival Nasyid Kebangsaan 2011-Selangor BTP version',
    year: 2011,
  },
  {
    id: '0Y3owGxsbrI',
    title: 'Festival Nasyid Kebangsaan 2011 - Selangor',
    year: 2011,
  },
  { id: 'GZko6ECoWCc', title: 'afu @ picc', year: 2011 },
  {
    id: 'HSRCLy3b5Fo',
    title: 'Ke Sekolah (Ethnic Version) - AFU Reunion Concert 16 April 2011',
    year: 2011,
  },
  {
    id: 'llY-TdKvnVg',
    title: 'Naib Johan Festival Nasyid Peringkat Negeri Selangor 2012 - All For Ummah',
    year: 2012,
  },
  { id: '8HNWWvXhNuM', title: 'All For Ummah 2012', year: 2012 },
  {
    id: 'pDQxtriCKa0',
    title: "AFU SMAP KAJANG@JOHAN BINTANG NASYID MU'MIN 2012 (SELANGOR)",
    year: 2012,
  },
  {
    id: 'Ui_LO2HGm40',
    title: "All For Ummah@Johan Nasyid Bintang Mu'min Negeri Selangor 2012",
    year: 2012,
  },
  {
    id: 'ajCpSx-zZQw',
    title: "Bintang Nasyid Mu'min Kebangsaan 2012@AFU SMAP Kajang",
    year: 2012,
  },
  {
    id: 'krSrZEUCzM4',
    title: 'Festival Nasyid Negeri Selangor 2014 | All For Ummah',
    year: 2014,
  },
  { id: '5sGLRoCFFb8', title: 'All For Ummah-Debat PPM 2014', year: 2014 },
  { id: 'RwUhGf8s0ZU', title: 'All For Ummah - Anugerah', year: 2014 },
  {
    id: '-XtLscH8CaA',
    title: 'FNSS Daerah Hulu Langat 2015 | All For Ummah (Johan)',
    year: 2015,
  },
  {
    id: 'm_yu8RltOdc',
    title: 'Naib Johan FNSS Selangor 2015 SM I ALL FOR UMMAH',
    year: 2015,
  },
  {
    id: '3FrBALqE-lQ',
    title:
      'Nyanyian gabungan Zakiuddin Hanafi bersama All For Ummah (AFU) sempena bulan Ramadhan.',
    year: 2015,
  },
  {
    id: 'thDrDmgEEL8',
    title: "Bintang Nasyid Mu'min Selangor 2015 | All For Ummah",
    year: 2015,
  },
  { id: 'WBr6O0JuEEY', title: 'ALL FOR UMMAH 2016 (belaian jiwa)', year: 2016 },
  { id: 'Zd7TH0npgoI', title: 'ALL FOR UMMAH 2016 (Bismillah majreha)', year: 2016 },
  {
    id: 'UZB5sXAC1Qc',
    title: 'Ketiga KDSS Selangor 2016 I All For Ummah (SMAPK)',
    year: 2016,
  },
];

/** @param {string} id */
export function getPlaylistVideo(id) {
  return playlistVideos.find((video) => video.id === id) ?? null;
}

/**
 * @returns {{ label: string, year: number | null, videos: PlaylistVideo[] }[]}
 */
export function getPlaylistByYear() {
  /** @type {Map<number | 'other', PlaylistVideo[]>} */
  const groups = new Map();

  for (const video of playlistVideos) {
    const key = video.year ?? 'other';
    const list = groups.get(key) ?? [];
    list.push(video);
    groups.set(key, list);
  }

  const years = [...groups.keys()]
    .filter((key) => key !== 'other')
    .sort((a, b) => Number(b) - Number(a));

  /** @type {{ label: string, year: number | null, videos: PlaylistVideo[] }[]} */
  const sections = years.map((year) => ({
    label: String(year),
    year: Number(year),
    videos: groups.get(year) ?? [],
  }));

  const other = groups.get('other');
  if (other?.length) {
    sections.push({ label: 'Others', year: null, videos: other });
  }

  return sections;
}

/**
 * Top picks by YouTube view count (playlist PL92BFBBF327B474AF, checked Jul 2026).
 * @returns {PlaylistVideo[]}
 */
export function getTopPicks() {
  const ids = [
    '-_FMjiXUACU',
    'UZB5sXAC1Qc',
    'jE1IazI8rN8',
    'F6jYjtObBdw',
    'm_yu8RltOdc',
  ];
  return ids.flatMap((id) => {
    const video = getPlaylistVideo(id);
    return video ? [video] : [];
  });
}
