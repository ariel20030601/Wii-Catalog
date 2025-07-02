import { XMLParser } from 'fast-xml-parser';


const getCoverUrl = (id, lang = "EN") => {
  return `https://art.gametdb.com/wii/cover3D/${lang}/${id}.png`;
}

export const getFullCoverUrl = (id, lang = "EN") => {
    return `https://art.gametdb.com/wii/coverfull/${lang}/${id}.png`;
}



const extractTitle = (game, preferredLang = "EN") => {

    if (!game.locale) return "Unknown";

  const locales = Array.isArray(game.locale) ? game.locale : [game.locale];

  const match = locales.find(loc => loc["@_lang"] === preferredLang);
  if (match?.title) return match.title;

  return locales[0]?.title || "Unknown";
};

const extractSynopsis = (game, preferredLang = "EN") => {
    if (!game.locale) return "Unknown";

    const locales = Array.isArray(game.locale) ? game.locale : [game.locale];

    const match = locales.find(loc => loc["@_lang"] === preferredLang);
    if (match?.synopsis) return match.synopsis;

    return locales[0]?.synopsis || "Unknown";
}

export function formatSynopsis(synopsis) {
  if (!synopsis) return "";

  let formatted = synopsis.replace(
    /\b([A-Z\s]{4,})[:\-]?\b/g,
    "\n<b>$1</b>\n"
  );

  formatted = formatted.replace(/([.?!])\s+(?=[A-Z])/g, "$1\n");

  return formatted.trim();
}


let gamesCache = null;

export const getGames = async () => {
    if (gamesCache) return gamesCache;

    const res = await fetch('/wiitdb.xml');
    const text = await res.text();

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });
    const json = parser.parse(text);

    const gameData = json.datafile?.game || [];
    const normalized = Array.isArray(gameData) ? gameData : [gameData];

    gamesCache = normalized.map(game => ({
        id: game.id,
        synopsis: extractSynopsis(game, "EN"),
        title: extractTitle(game, "EN"),
        region: game.region,
        publisher: game.publisher,
        date: `${game.date?.["@_year"]}-${game.date?.["@_month"]}-${game.date?.["@_day"]}`,
        genres: game.genre?.split(',') || [],
        cover: getCoverUrl(game.id),
    }));

    return gamesCache;
};

export const findGameByID = async (ID) => {
    const allgames = await getGames();
    return allgames.find(game => game.id === ID);
};


export const findSimilarGames = async(TheGame) => {
    if (!TheGame || !TheGame.title) return [];

     const allGames = await getGames();
     const lowerTitle = TheGame.title.toLowerCase();
     const keyword = lowerTitle.split(' ')[0];

    const similar = allGames.filter(game => {
    const title = typeof game.title === "string" ? game.title.toLowerCase() : "";
    return title.includes(keyword) && game.id !== TheGame.id;
  });

  return similar.slice(0, 10);
}


export const searchGames = async (games, query) => {
    const lowerQuery = query.toLowerCase();

     return games.filter((game) => {
        const title = typeof game.title === "string" ? game.title : "";
        return title.toLowerCase().includes(lowerQuery);
    });
};