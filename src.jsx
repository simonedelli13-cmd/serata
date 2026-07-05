import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Search,
  Library,
  UserRound,
  Play,
  Plus,
  Check,
  Heart,
  Clock3,
  Star,
  Sparkles,
  ChevronRight,
  X,
  Timer,
  Film,
  Clapperboard,
  Download,
  Upload,
  MessageCircle,
} from "lucide-react";
import "./style.css";
import "./theme.css";
import "./thumbnails.css";

const seed = [
  {
    id: 1,
    poster: "https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    title: "The Bear",
    type: "Serie",
    year: 2022,
    genre: "Dramma · Commedia",
    seasons: 3,
    episodes: 28,
    seen: 21,
    rating: 8.6,
    color: "#d85b32",
    emoji: "🍽️",
    fav: true,
    minutes: 630,
    review:
      "Una cucina sotto pressione e una famiglia imperfetta. Intensa, umana, irresistibile.",
  },
  {
    id: 2,
    poster: "https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
    title: "House of the Dragon",
    type: "Serie",
    year: 2022,
    genre: "Fantasy · Dramma",
    seasons: 2,
    episodes: 18,
    seen: 13,
    rating: 8.3,
    color: "#7d2835",
    emoji: "🐉",
    fav: true,
    minutes: 780,
    review: "Intrighi, dinastie e draghi in una produzione spettacolare.",
  },
  {
    id: 3,
    poster: "https://image.tmdb.org/t/p/w500/5Sg5uNLYvLui1rf9ZqWNLnruGEp.jpg",
    title: "Abbott Elementary",
    type: "Serie",
    year: 2021,
    genre: "Commedia",
    seasons: 4,
    episodes: 71,
    seen: 49,
    rating: 8.2,
    color: "#e9a23b",
    emoji: "✏️",
    fav: false,
    minutes: 1078,
    review:
      "Una commedia brillante, calda e piena di personaggi a cui affezionarsi.",
  },
  {
    id: 4,
    poster: "https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    title: "Past Lives",
    type: "Film",
    year: 2023,
    genre: "Romance · Dramma",
    episodes: 1,
    seen: 1,
    rating: 8.1,
    color: "#4f7e91",
    emoji: "🌙",
    fav: true,
    minutes: 106,
    review:
      "Delicato e profondo: parla di amore, tempo e delle vite che avremmo potuto vivere.",
  },
  {
    id: 5,
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    title: "Everything Everywhere",
    type: "Film",
    year: 2022,
    genre: "Sci-fi · Avventura",
    episodes: 1,
    seen: 1,
    rating: 8.7,
    color: "#604b92",
    emoji: "🥯",
    fav: true,
    minutes: 140,
    review: "Caotico, commovente e sorprendentemente intimo.",
  },
  {
    id: 6,
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    title: "The Last of Us",
    type: "Serie",
    year: 2023,
    genre: "Dramma · Avventura",
    seasons: 2,
    episodes: 16,
    seen: 9,
    rating: 8.8,
    color: "#315d49",
    emoji: "🍄",
    fav: false,
    minutes: 540,
    review: "Un viaggio duro e tenero in un mondo spezzato.",
  },
  {
    id: 7,
    poster: "https://image.tmdb.org/t/p/w500/yp8vEZflGynlEylxEesbYasc06i.jpg",
    title: "Ponyo",
    type: "Film",
    year: 2008,
    genre: "Animazione · Fantasy",
    episodes: 1,
    seen: 0,
    rating: 7.9,
    color: "#2196a7",
    emoji: "🐠",
    fav: false,
    minutes: 0,
    review: "Una fiaba marina gioiosa, dipinta con la meraviglia di Miyazaki.",
  },
];
const TMDB_KEY = localStorage.getItem("elitv-tmdb-key") || "";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500";
const fmt = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`);
function Poster({ item, onClick, wide = false }) {
  return (
    <button
      className={"poster " + (wide ? "wide" : "")}
      style={{
        "--c": item.color,
        backgroundImage: item.poster ? `url(${item.poster})` : undefined,
      }}
      onClick={() => onClick(item)}
    >
      {!item.poster && <span className="posterEmoji">{item.emoji}</span>}
      <span className="posterShade" />
      <span className="posterTitle">{item.title}</span>
      {item.seen === item.episodes && item.seen > 0 && (
        <span className="done">
          <Check size={13} />
        </span>
      )}
      <span className="posterMeta">{item.year}</span>
    </button>
  );
}
function App() {
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem("serata-items") || "null") || seed,
  );
  const [tab, setTab] = useState("Oggi");
  const [detail, setDetail] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tutti");
  const [timer, setTimer] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [adding, setAdding] = useState(false);
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [profile, setProfile] = useState(
    () =>
      JSON.parse(localStorage.getItem("serata-profile") || "null") || {
        name: "Elisa",
        surname: "Masia",
        nickname: "Elisa",
        photo: "",
        theme: "dark",
      },
  );
  const [lists, setLists] = useState(
    () => JSON.parse(localStorage.getItem("elitv-lists") || "null") || [],
  );
  const [activeList, setActiveList] = useState(null);
  useEffect(
    () => localStorage.setItem("serata-items", JSON.stringify(items)),
    [items],
  );
  useEffect(
    () => localStorage.setItem("serata-profile", JSON.stringify(profile)),
    [profile],
  );
  useEffect(
    () => localStorage.setItem("elitv-lists", JSON.stringify(lists)),
    [lists],
  );
  useEffect(
    () =>
      setItems((xs) =>
        xs.map((x) => ({
          ...x,
          poster: x.poster || seed.find((s) => s.id === x.id)?.poster,
        })),
      ),
    [],
  );
  useEffect(() => {
    if (!timer) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [timer]);
  useEffect(() => {
    if (tab === "Scopri" && !TMDB_KEY) {
      const key = window.prompt(
        "Incolla la chiave API TMDB. Verrà salvata soltanto su questo dispositivo.",
      );
      if (key?.trim()) {
        localStorage.setItem("elitv-tmdb-key", key.trim());
        window.location.reload();
      }
    }
  }, [tab]);
  useEffect(() => {
    if (query.trim().length < 2) {
      setTmdbResults([]);
      return;
    }
    const controller = new AbortController(),
      id = setTimeout(async () => {
        setTmdbLoading(true);
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&language=it-IT&include_adult=false&query=${encodeURIComponent(query)}`,
            { signal: controller.signal },
          );
          const data = await res.json();
          setTmdbResults(
            (data.results || [])
              .filter((x) => x.media_type === "movie" || x.media_type === "tv")
              .slice(0, 12)
              .map((x) => ({
                id: `tmdb-${x.media_type}-${x.id}`,
                tmdbId: x.id,
                title: x.title || x.name,
                type: x.media_type === "movie" ? "Film" : "Serie",
                year:
                  Number(
                    (x.release_date || x.first_air_date || "").slice(0, 4),
                  ) || "",
                genre: "Da TMDB",
                episodes: 1,
                seen: 0,
                rating: Number((x.vote_average || 0).toFixed(1)),
                poster: x.poster_path ? TMDB_IMAGE + x.poster_path : "",
                color: "#333",
                emoji: x.media_type === "movie" ? "🎬" : "📺",
                fav: false,
                minutes: 0,
                review: x.overview || "Nessuna descrizione disponibile.",
              })),
          );
        } catch (e) {
          if (e.name !== "AbortError") setTmdbResults([]);
        } finally {
          setTmdbLoading(false);
        }
      }, 350);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query]);
  const watched = items.reduce((a, x) => a + x.minutes, 0),
    eps = items.reduce((a, x) => a + x.seen, 0),
    progress = items.filter(
      (x) => x.type === "Serie" && x.seen < x.episodes && x.seen > 0 && x.fav,
    );
  const update = (id, p) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...p } : x)));
    setDetail((d) => (d?.id === id ? { ...d, ...p } : d));
    if (p.fav === false && filter === "Preferiti") setDetail(null);
  };
  const stopTimer = () => {
    if (timer) {
      update(timer.id, {
        minutes: timer.minutes + Math.max(1, Math.round(seconds / 60)),
      });
      setTimer(null);
      setSeconds(0);
    }
  };
  const results = (query.trim().length >= 2 ? tmdbResults : items).filter(
    (x) =>
      (filter === "Tutti" || x.type === filter) &&
      x.title.toLowerCase().includes(query.toLowerCase()),
  );
  const recommendations = useMemo(
    () =>
      items
        .filter((x) => !x.seen)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [items],
  );
  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), items },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "serata-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.items)) throw new Error();
        setItems(data.items);
        alert("Backup importato correttamente.");
      } catch {
        alert("Questo file non è un backup valido di Serata.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const askChatGPT = (item) => {
    const prompt = `Consigliami una serie o un film simile a ${item.title}. Mi piacciono anche: ${items
      .filter((x) => x.fav)
      .map((x) => x.title)
      .join(", ")}. Rispondi in italiano senza spoiler.`;
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const addTitle = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      title = String(f.get("title")).trim(),
      chosenType = f.get("type");
    let found = null;
    try {
      const r = await fetch(
          `https://api.themoviedb.org/3/search/${chosenType === "Film" ? "movie" : "tv"}?api_key=${TMDB_KEY}&language=it-IT&query=${encodeURIComponent(title)}`,
        ),
        d = await r.json();
      found = d.results?.[0];
    } catch {}
    const type = chosenType,
      episodes =
        type === "Film" ? 1 : Math.max(1, Number(f.get("episodes")) || 1);
    setItems((xs) => [
      ...xs,
      {
        id: Date.now(),
        tmdbId: found?.id,
        title: found?.title || found?.name || title,
        type,
        year:
          Number(
            (found?.release_date || found?.first_air_date || "").slice(0, 4),
          ) ||
          Number(f.get("year")) ||
          new Date().getFullYear(),
        genre: String(f.get("genre") || "Altro"),
        seasons:
          type === "Serie"
            ? Math.max(1, Number(f.get("seasons")) || 1)
            : undefined,
        episodes,
        seen: 0,
        rating: Number((found?.vote_average || 0).toFixed(1)),
        poster: found?.poster_path ? TMDB_IMAGE + found.poster_path : "",
        color: "#333",
        emoji: type === "Film" ? "🎬" : "📺",
        fav: false,
        minutes: 0,
        review: found?.overview || "Aggiunto alla tua libreria personale.",
      },
    ]);
    setAdding(false);
  };
  const removeTitle = (id) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
    setDetail(null);
  };
  const createList = () => {
    const name = window.prompt("Come vuoi chiamare la nuova lista?");
    if (name?.trim())
      setLists((xs) => [
        ...xs,
        { id: Date.now(), name: name.trim(), itemIds: [] },
      ]);
  };
  const toggleListItem = (listId, itemId) =>
    setLists((xs) =>
      xs.map((l) =>
        l.id === listId
          ? {
              ...l,
              itemIds: l.itemIds.includes(itemId)
                ? l.itemIds.filter((id) => id !== itemId)
                : [...l.itemIds, itemId],
            }
          : l,
      ),
    );
  const libraryItems = items.filter((x) =>
    activeList
      ? lists.find((l) => l.id === activeList)?.itemIds.includes(x.id)
      : filter === "Tutti" ||
        (filter === "In corso" && x.seen > 0 && x.seen < x.episodes) ||
        (filter === "Visti" && x.seen === x.episodes) ||
        (filter === "Preferiti" && x.fav),
  );
  const selectTitle = (x) => {
    if (String(x.id).startsWith("tmdb-")) {
      const saved = { ...x, id: Date.now() };
      setItems((xs) =>
        xs.some((i) => i.tmdbId === x.tmdbId && i.type === x.type)
          ? xs
          : [...xs, saved],
      );
      setDetail(saved);
    } else setDetail(x);
  };
  const initials = (
    (profile.name?.[0] || "") + (profile.surname?.[0] || "")
  ).toUpperCase();
  const avatar = (
    <span className="avatarVisual">
      {profile.photo ? (
        <img src={profile.photo} alt="Foto profilo" />
      ) : (
        initials
      )}
    </span>
  );
  const changePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((p) => ({ ...p, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };
  return (
    <div className={"app theme-" + profile.theme}>
      <main>
        {tab === "Oggi" && (
          <>
            <header>
              <div>
                <p className="eyebrow">DOMENICA, 5 LUGLIO</p>
                <h1>
                  Ciao, {profile.nickname || profile.name} <span>✦</span>
                </h1>
                <p className="muted">Cosa guardiamo stasera?</p>
              </div>
              <button className="avatar" onClick={() => setTab("Profilo")}>
                {avatar}
              </button>
            </header>
            <section className="hero">
              <div>
                <span className="pill">
                  <Sparkles size={14} /> PER TE
                </span>
                <h2>
                  La tua prossima
                  <br />
                  bella storia
                </h2>
                <p>Riprendi The Bear da S03 · E08</p>
                <button className="primary" onClick={() => setDetail(items[0])}>
                  <Play size={17} fill="currentColor" /> Continua
                </button>
              </div>
              <div className="heroArt">🍽️</div>
            </section>
            <div className="sectionHead">
              <h3>Continua a guardare</h3>
              <button onClick={() => setTab("Libreria")}>
                Vedi tutto <ChevronRight size={16} />
              </button>
            </div>
            <div className="continue">
              {progress.map((x) => (
                <button
                  className="continueCard"
                  key={x.id}
                  onClick={() => setDetail(x)}
                >
                  <div
                    className="miniArt"
                    style={{
                      "--c": x.color,
                      backgroundImage: x.poster
                        ? `url(${x.poster})`
                        : undefined,
                    }}
                  >
                    {!x.poster && x.emoji}
                    <span className="miniPlay">
                      <Play size={16} fill="currentColor" />
                    </span>
                  </div>
                  <div>
                    <b>{x.title}</b>
                    <span>
                      S
                      {String(
                        Math.min(x.seasons || 1, Math.ceil(x.seen / 8)),
                      ).padStart(2, "0")}{" "}
                      · E{String(x.seen + 1).padStart(2, "0")}
                    </span>
                    <div className="bar">
                      <i style={{ width: `${(x.seen / x.episodes) * 100}%` }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="stats">
              <div>
                <Clock3 />
                <span>
                  <b>{fmt(watched)}</b>
                  <small>tempo visto</small>
                </span>
              </div>
              <div>
                <Clapperboard />
                <span>
                  <b>{eps}</b>
                  <small>episodi</small>
                </span>
              </div>
              <div>
                <Heart />
                <span>
                  <b>{items.filter((x) => x.fav).length}</b>
                  <small>preferiti</small>
                </span>
              </div>
            </div>
            <div className="sectionHead">
              <h3>I tuoi preferiti</h3>
            </div>
            <div className="posterRow">
              {items
                .filter((x) => x.fav)
                .map((x) => (
                  <Poster key={x.id} item={x} onClick={setDetail} />
                ))}
            </div>
          </>
        )}
        {tab === "Scopri" && (
          <>
            <header>
              <div>
                <p className="eyebrow">CATALOGO TMDB</p>
                <h1>Scopri</h1>
                <p className="muted">
                  Cerca tra milioni di serie e film con copertine originali.
                </p>
              </div>
            </header>
            <label className="search">
              <Search />
              <input
                autoFocus
                placeholder="Titolo della serie o del film..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <X onClick={() => setQuery("")} />}
            </label>
            <div className="filters">
              {["Tutti", "Serie", "Film"].map((x) => (
                <button
                  key={x}
                  className={filter === x ? "active" : ""}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </button>
              ))}
            </div>
            {tmdbLoading && <p className="muted">Ricerca in corso…</p>}
            <div className="discoverGrid">
              {results.map((x) => (
                <Poster key={x.id} item={x} onClick={selectTitle} />
              ))}
            </div>
            <div className="sectionHead">
              <h3>Potrebbero piacerti</h3>
            </div>
            <div className="recommendations">
              {recommendations.map((x) => (
                <button key={x.id} onClick={() => setDetail(x)}>
                  <span style={{ "--c": x.color }}>{x.emoji}</span>
                  <div>
                    <b>{x.title}</b>
                    <small>Scelto dai tuoi gusti · {x.rating}/10</small>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
            <div className="aiCard">
              <Sparkles />
              <div>
                <b>Dati e copertine da TMDB</b>
                <p>
                  La ricerca usa il catalogo gratuito di The Movie Database.
                </p>
              </div>
            </div>
          </>
        )}
        {tab === "Libreria" && (
          <>
            <header>
              <div>
                <p className="eyebrow">LA TUA COLLEZIONE</p>
                <h1>Libreria</h1>
                <p className="muted">{items.length} titoli, tutti tuoi.</p>
              </div>
              <button
                className="circle"
                onClick={() => setAdding(true)}
                aria-label="Aggiungi titolo"
              >
                <Plus />
              </button>
            </header>
            <div className="libraryTabs">
              {["Tutti", "In corso", "Visti", "Preferiti"].map((x) => (
                <button
                  key={x}
                  className={!activeList && filter === x ? "active" : ""}
                  onClick={() => {
                    setActiveList(null);
                    setFilter(x);
                  }}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className="customLists">
              <button className="newList" onClick={createList}>
                <Plus size={16} /> Nuova lista
              </button>
              {lists.map((l) => (
                <button
                  key={l.id}
                  className={activeList === l.id ? "active" : ""}
                  onClick={() => setActiveList(l.id)}
                >
                  {l.name}
                  <small>{l.itemIds.length}</small>
                </button>
              ))}
            </div>
            <div className="libraryList">
              {libraryItems.map((x) => (
                <button key={x.id} onClick={() => setDetail(x)}>
                  <div
                    className="listArt"
                    style={{
                      "--c": x.color,
                      backgroundImage: x.poster
                        ? `url(${x.poster})`
                        : undefined,
                    }}
                  >
                    {!x.poster && x.emoji}
                  </div>
                  <div>
                    <b>{x.title}</b>
                    <span>
                      {x.type} · {x.year}
                    </span>
                    {x.type === "Serie" && (
                      <div className="bar">
                        <i
                          style={{ width: `${(x.seen / x.episodes) * 100}%` }}
                        />
                      </div>
                    )}
                    <small>
                      {x.type === "Serie"
                        ? `${x.seen} di ${x.episodes} episodi`
                        : x.seen
                          ? "Visto"
                          : "Da vedere"}
                    </small>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
            {libraryItems.length === 0 && (
              <div className="emptyState">
                <Library />
                <b>Questa lista è vuota</b>
                <span>Aggiungi un titolo dalla sua scheda.</span>
              </div>
            )}
          </>
        )}
        {tab === "Profilo" && (
          <>
            <header>
              <div>
                <p className="eyebrow">IL TUO MONDO</p>
                <h1>{profile.nickname || profile.name}</h1>
                <p className="muted">Ogni storia lascia una traccia.</p>
              </div>
              <label className="avatar big editable">
                {avatar}
                <input type="file" accept="image/*" onChange={changePhoto} />
              </label>
            </header>
            <div className="profileHero">
              <span>Tempo totale</span>
              <b>{fmt(watched)}</b>
              <p>
                È come guardare {Math.floor(watched / 480)} giornate intere di
                storie ✨
              </p>
            </div>
            <div className="profileStats">
              <div>
                <Film />
                <b>{items.filter((x) => x.type === "Film" && x.seen).length}</b>
                <span>film visti</span>
              </div>
              <div>
                <Clapperboard />
                <b>{eps}</b>
                <span>episodi</span>
              </div>
              <div>
                <Star />
                <b>{items.filter((x) => x.fav).length}</b>
                <span>preferiti</span>
              </div>
            </div>
            <section className="settings">
              <div className="sectionHead">
                <h3>Personalizza profilo</h3>
              </div>
              <div className="profileForm">
                <label>
                  Nome
                  <input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Cognome
                  <input
                    value={profile.surname}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, surname: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Nickname
                  <input
                    value={profile.nickname}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, nickname: e.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="themeChoice">
                <span>Tema dell’app</span>
                <button
                  className={profile.theme === "dark" ? "active" : ""}
                  onClick={() => setProfile((p) => ({ ...p, theme: "dark" }))}
                >
                  Notte
                </button>
                <button
                  className={profile.theme === "light" ? "active" : ""}
                  onClick={() => setProfile((p) => ({ ...p, theme: "light" }))}
                >
                  Giorno
                </button>
              </div>
              <label className="photoButton">
                <Upload /> Scegli foto profilo
                <input type="file" accept="image/*" onChange={changePhoto} />
              </label>
            </section>
            <h3>Generi del cuore</h3>
            <div className="genres">
              <span>Dramma</span>
              <span>Commedia</span>
              <span>Fantasy</span>
              <span>Animazione</span>
            </div>
            <section className="dataBox">
              <div>
                <b>I tuoi dati restano tuoi</b>
                <p>
                  Salvati soltanto su questo dispositivo. Crea un backup ogni
                  tanto per non perderli.
                </p>
              </div>
              <div className="dataActions">
                <button onClick={exportData}>
                  <Download /> Esporta backup
                </button>
                <label>
                  <Upload /> Importa backup
                  <input
                    type="file"
                    accept="application/json"
                    onChange={importData}
                  />
                </label>
              </div>
            </section>
          </>
        )}
        {adding && (
          <div className="overlay" onClick={() => setAdding(false)}>
            <form
              className="addSheet"
              onSubmit={addTitle}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="close"
                onClick={() => setAdding(false)}
              >
                <X />
              </button>
              <p className="eyebrow">NUOVO TITOLO</p>
              <h2>Aggiungi alla libreria</h2>
              <label>
                Titolo
                <input
                  name="title"
                  required
                  autoFocus
                  placeholder="Es. Severance"
                />
              </label>
              <div className="formRow">
                <label>
                  Tipo
                  <select name="type">
                    <option>Serie</option>
                    <option>Film</option>
                  </select>
                </label>
                <label>
                  Anno
                  <input
                    name="year"
                    type="number"
                    min="1900"
                    max="2100"
                    defaultValue={new Date().getFullYear()}
                  />
                </label>
              </div>
              <label>
                Genere
                <input name="genre" placeholder="Dramma, commedia..." />
              </label>
              <div className="formRow">
                <label>
                  Stagioni
                  <input
                    name="seasons"
                    type="number"
                    min="1"
                    defaultValue="1"
                  />
                </label>
                <label>
                  Episodi totali
                  <input
                    name="episodes"
                    type="number"
                    min="1"
                    defaultValue="1"
                  />
                </label>
              </div>
              <button className="primary" type="submit">
                <Plus /> Aggiungi
              </button>
            </form>
          </div>
        )}
      </main>
      <nav>
        {[
          ["Oggi", Home],
          ["Scopri", Search],
          ["Libreria", Library],
          ["Profilo", UserRound],
        ].map(([x, I]) => (
          <button
            key={x}
            className={tab === x ? "active" : ""}
            onClick={() => {
              setTab(x);
              setFilter("Tutti");
            }}
          >
            <I />
            <span>{x}</span>
          </button>
        ))}
      </nav>
      {detail && lists.length > 0 && (
        <div className="listQuick">
          <span>Le tue liste</span>
          {lists.map((l) => (
            <button
              key={l.id}
              className={l.itemIds.includes(detail.id) ? "on" : ""}
              onClick={() => toggleListItem(l.id, detail.id)}
            >
              {l.itemIds.includes(detail.id) ? (
                <Check size={14} />
              ) : (
                <Plus size={14} />
              )}{" "}
              {l.name}
            </button>
          ))}
        </div>
      )}
      {detail && (
        <div className="overlay" onClick={() => setDetail(null)}>
          <article className="sheet" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setDetail(null)}>
              <X />
            </button>
            <div
              className="detailArt"
              style={{
                "--c": detail.color,
                backgroundImage: detail.poster
                  ? `linear-gradient(0deg, rgba(0,0,0,.16), rgba(0,0,0,0)), url(${detail.poster})`
                  : undefined,
              }}
            >
              {!detail.poster && detail.emoji}
            </div>
            <div className="detailBody">
              <span className="eyebrow">
                {detail.type} · {detail.year}
              </span>
              <h2>{detail.title}</h2>
              <p className="muted">{detail.genre}</p>
              <div className="rating">
                <Star fill="currentColor" /> {detail.rating}{" "}
                <small>valutazione globale</small>
              </div>
              <p className="review">{detail.review}</p>
              <div className="detailActions">
                <button
                  className="primary"
                  onClick={() =>
                    timer ? stopTimer() : (setTimer(detail), setSeconds(0))
                  }
                >
                  {timer?.id === detail.id ? (
                    <>
                      <Timer /> Termina ·{" "}
                      {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                      {String(seconds % 60).padStart(2, "0")}
                    </>
                  ) : (
                    <>
                      <Play fill="currentColor" /> Registra visione
                    </>
                  )}
                </button>
                <button
                  className={"heart " + (detail.fav ? "on" : "")}
                  onClick={() => update(detail.id, { fav: !detail.fav })}
                >
                  <Heart fill={detail.fav ? "currentColor" : "none"} />
                </button>
              </div>
              {detail.type === "Serie" && (
                <div className="episodeBox">
                  <div>
                    <span>Progresso</span>
                    <b>
                      {detail.seen} / {detail.episodes} episodi
                    </b>
                  </div>
                  <div className="counter">
                    <button
                      disabled={!detail.seen}
                      onClick={() =>
                        update(detail.id, { seen: detail.seen - 1 })
                      }
                    >
                      −
                    </button>
                    <strong>{detail.seen}</strong>
                    <button
                      disabled={detail.seen === detail.episodes}
                      onClick={() =>
                        update(detail.id, {
                          seen: detail.seen + 1,
                          minutes: detail.minutes + 45,
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="bar">
                    <i
                      style={{
                        width: `${(detail.seen / detail.episodes) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
