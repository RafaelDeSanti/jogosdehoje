const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const ligasFavoritas = JSON.parse(localStorage.getItem("ligasFavoritas") || "[]");

const ligas = [
  "English Premier League",
  "Spanish La Liga",
  "Brasileirão Série A"
];

function formatarData(d) {
  return d.toISOString().split("T")[0];
}

function renderizarJogo(jogo, container) {
  const div = document.createElement("div");
  div.className = "jogo";
  
  const nomeLiga = jogo.strLeague;
  const nomeTime1 = jogo.strHomeTeam;
  const nomeTime2 = jogo.strAwayTeam;
  const hora = jogo.strTime || "??:??";
  const placar = jogo.intHomeScore != null ? `${jogo.intHomeScore} x ${jogo.intAwayScore}` : "vs";

  if (ligasFavoritas.includes(nomeLiga)) {
    div.classList.add("favorito");
  }

  div.innerHTML = `
    <strong>${nomeTime1} ${placar} ${nomeTime2}</strong><br />
    <small>${nomeLiga} - ${hora}</small>
  `;

  container.appendChild(div);
}

async function buscarJogosPorDia(dataISO, liga) {
  try {
    const url = `${API_BASE}/eventsday.php?d=${dataISO}&l=${encodeURIComponent(liga)}`;
    const resp = await fetch(url);
    const dados = await resp.json();
    return dados.events || [];
  } catch (e) {
    console.error("Erro ao buscar jogos:", e);
    return [];
  }
}

async function carregarJogos() {
  const hoje = new Date();
  const ultimosContainer = document.getElementById("ultimos-container");
  const proximosContainer = document.getElementById("proximos-container");

  for (let i = 7; i >= 1; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const dataStr = formatarData(data);

    await Promise.all(ligas.map(async (liga) => {
      const jogos = await buscarJogosPorDia(dataStr, liga);
      jogos.forEach(j => renderizarJogo(j, ultimosContainer));
    }));
  }

  for (let i = 0; i < 7; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);
    const dataStr = formatarData(data);

    await Promise.all(ligas.map(async (liga) => {
      const jogos = await buscarJogosPorDia(dataStr, liga);
      jogos.forEach(j => renderizarJogo(j, proximosContainer));
    }));
  }
}

carregarJogos();
