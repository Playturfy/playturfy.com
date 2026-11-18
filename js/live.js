/**
 * Turfy - Live Web Scoreboard & Tournament Bracket Viewer
 * Supports ?id=<tournamentId>, live Firestore REST polling, and featured demo mode.
 */
(function () {
  'use strict';

  const FIRESTORE_BASE =
    'https://firestore.googleapis.com/v1/projects/football-45d72/databases/(default)/documents';

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function decodeFirestoreValue(val) {
    if (!val || typeof val !== 'object') return null;
    if ('stringValue' in val) return val.stringValue;
    if ('integerValue' in val) return parseInt(val.integerValue, 10);
    if ('doubleValue' in val) return Number(val.doubleValue);
    if ('booleanValue' in val) return Boolean(val.booleanValue);
    if ('timestampValue' in val) return val.timestampValue;
    if ('nullValue' in val) return null;
    if ('arrayValue' in val) {
      return (val.arrayValue.values || []).map(decodeFirestoreValue);
    }
    if ('mapValue' in val) {
      const obj = {};
      const fields = val.mapValue.fields || {};
      for (const k of Object.keys(fields)) {
        obj[k] = decodeFirestoreValue(fields[k]);
      }
      return obj;
    }
    return null;
  }

  function parseFirestoreDoc(doc) {
    const out = { id: doc.name ? doc.name.split('/').pop() : '' };
    const fields = doc.fields || {};
    for (const k of Object.keys(fields)) {
      out[k] = decodeFirestoreValue(fields[k]);
    }
    return out;
  }

  // Featured interactive demo tournament for visitors landing directly on /live.html
  const DEMO_TOURNAMENT = {
    id: 'demo',
    isDemo: true,
    name: 'Dhaka Friday Night Turf Cup (7v7)',
    organizerName: 'Turfy Official Demo',
    status: 'ongoing',
    format: 'groupKnockout2',
    teams: [
      { id: 't1', name: 'Riverside FC' },
      { id: 't2', name: 'East End Athletic' },
      { id: 't3', name: 'Gulshan United' },
      { id: 't4', name: 'Bashundhara XI' },
      { id: 't5', name: 'Mirpur Rovers' },
      { id: 't6', name: 'Banani Strikers' },
      { id: 't7', name: 'Uttara Kings' },
      { id: 't8', name: 'Dhanmondi Blues' }
    ],
    matches: [
      {
        id: 'm1',
        teamAId: 't1',
        teamBId: 't2',
        status: 'inProgress',
        teamAScore: 3,
        teamBScore: 2,
        round: 'Semi-Final 1 · 38\' Live',
        roundNumber: 4,
        scheduledTime: new Date().toISOString(),
        events: [
          { type: 'goal', teamId: 't1', playerName: 'Omar Al-Farsi', assistPlayerName: 'Lars Eri', minute: 7 },
          { type: 'goal', teamId: 't2', playerName: 'Marco Silva', minute: 14 },
          { type: 'yellow_card', teamId: 't1', playerName: 'Emeka Obi', minute: 21 },
          { type: 'goal', teamId: 't1', playerName: 'Jack Thornton', assistPlayerName: 'Kenji Takahashi', minute: 27 },
          { type: 'goal', teamId: 't2', playerName: 'Rafiq Hasan', minute: 33 },
          { type: 'goal', teamId: 't1', playerName: 'Omar Al-Farsi', minute: 36 }
        ]
      },
      {
        id: 'm2',
        teamAId: 't3',
        teamBId: 't5',
        status: 'scheduled',
        teamAScore: 0,
        teamBScore: 0,
        round: 'Semi-Final 2',
        roundNumber: 4,
        scheduledTime: new Date(Date.now() + 45 * 60000).toISOString(),
        events: []
      },
      {
        id: 'm3',
        teamAId: 't1',
        teamBId: 't3',
        status: 'completed',
        teamAScore: 2,
        teamBScore: 1,
        round: 'Group A',
        roundNumber: 1,
        scheduledTime: new Date(Date.now() - 4 * 3600000).toISOString(),
        events: [
          { type: 'goal', teamId: 't1', playerName: 'Lars Eri', minute: 11 },
          { type: 'goal', teamId: 't3', playerName: 'Arjun Mehta', minute: 24 },
          { type: 'goal', teamId: 't1', playerName: 'Jack Thornton', assistPlayerName: 'Omar Al-Farsi', minute: 39 }
        ]
      },
      {
        id: 'm4',
        teamAId: 't4',
        teamBId: 't2',
        status: 'completed',
        teamAScore: 1,
        teamBScore: 3,
        round: 'Group A',
        roundNumber: 2,
        scheduledTime: new Date(Date.now() - 3 * 3600000).toISOString(),
        events: [
          { type: 'goal', teamId: 't2', playerName: 'Marco Silva', minute: 9 },
          { type: 'goal', teamId: 't2', playerName: 'Marco Silva', assistPlayerName: 'Rafiq Hasan', minute: 19 },
          { type: 'goal', teamId: 't4', playerName: 'Tariq Zaman', minute: 28 },
          { type: 'goal', teamId: 't2', playerName: 'Rafiq Hasan', minute: 37 }
        ]
      },
      {
        id: 'm5',
        teamAId: 't5',
        teamBId: 't6',
        status: 'completed',
        teamAScore: 4,
        teamBScore: 1,
        round: 'Group B',
        roundNumber: 1,
        scheduledTime: new Date(Date.now() - 2 * 3600000).toISOString(),
        events: [
          { type: 'goal', teamId: 't5', playerName: 'Kenji Takahashi', minute: 6 },
          { type: 'goal', teamId: 't5', playerName: 'Kenji Takahashi', minute: 18 },
          { type: 'goal', teamId: 't6', playerName: 'Lucas Moura', minute: 25 },
          { type: 'goal', teamId: 't5', playerName: 'Sami Karim', minute: 31 },
          { type: 'goal', teamId: 't5', playerName: 'Kenji Takahashi', minute: 38 }
        ]
      },
      {
        id: 'm6',
        teamAId: 't7',
        teamBId: 't8',
        status: 'completed',
        teamAScore: 2,
        teamBScore: 2,
        round: 'Group B',
        roundNumber: 2,
        scheduledTime: new Date(Date.now() - 1 * 3600000).toISOString(),
        events: [
          { type: 'goal', teamId: 't7', playerName: 'Nabil Roy', minute: 10 },
          { type: 'goal', teamId: 't8', playerName: 'Gabriel Costa', minute: 15 },
          { type: 'goal', teamId: 't7', playerName: 'Nabil Roy', minute: 29 },
          { type: 'goal', teamId: 't8', playerName: 'Gabriel Costa', minute: 39 }
        ]
      }
    ]
  };

  let activeTournament = DEMO_TOURNAMENT;
  let activeMatchId = null;
  let pollTimer = null;

  function getTeamMap(tournament) {
    const map = {};
    (tournament.teams || []).forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }

  function normalizeStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('progress') || s === 'live') return 'live';
    if (s.includes('complete') || s === 'finished' || s === 'ft') return 'completed';
    return 'scheduled';
  }

  function isKnockoutRound(round) {
    const r = String(round || '').toLowerCase();
    return (
      r.includes('final') ||
      r.includes('quarter') ||
      r.includes('semi') ||
      r.includes('round of') ||
      r.includes('r16') ||
      r.includes('knockout') ||
      r.includes('playoff')
    );
  }

  function computeStandings(tournament) {
    const teams = tournament.teams || [];
    const stats = {};
    teams.forEach((t) => {
      stats[t.id] = { id: t.id, name: t.name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });

    (tournament.matches || []).forEach((m) => {
      const st = normalizeStatus(m.status);
      if (st === 'scheduled') return;
      if (isKnockoutRound(m.round) && teams.length > 5) return;
      const a = stats[m.teamAId];
      const b = stats[m.teamBId];
      if (!a || !b) return;

      const ga = Number(m.teamAScore || 0);
      const gb = Number(m.teamBScore || 0);
      a.p += 1;
      b.p += 1;
      a.gf += ga;
      a.ga += gb;
      b.gf += gb;
      b.ga += ga;

      if (ga > gb) {
        a.w += 1;
        a.pts += 3;
        b.l += 1;
      } else if (gb > ga) {
        b.w += 1;
        b.pts += 3;
        a.l += 1;
      } else {
        a.d += 1;
        b.d += 1;
        a.pts += 1;
        b.pts += 1;
      }
    });

    const rows = Object.values(stats);
    rows.forEach((r) => {
      r.gd = r.gf - r.ga;
    });
    rows.sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || x.name.localeCompare(y.name));
    return rows;
  }

  function computeTopScorers(tournament) {
    const teamMap = getTeamMap(tournament);
    const players = {};
    (tournament.matches || []).forEach((m) => {
      (m.events || []).forEach((ev) => {
        const type = String(ev.type || '').toLowerCase();
        if (type.includes('goal') && !type.includes('own') && ev.playerName) {
          const teamName = (teamMap[ev.teamId] && teamMap[ev.teamId].name) || 'Team';
          const key = `${ev.playerName}::${ev.teamId || teamName}`;
          if (!players[key]) {
            players[key] = { name: ev.playerName, team: teamName, goals: 0, assists: 0 };
          }
          players[key].goals += 1;
        }
        if (ev.assistPlayerName) {
          const teamName = (teamMap[ev.teamId] && teamMap[ev.teamId].name) || 'Team';
          const key = `${ev.assistPlayerName}::${ev.teamId || teamName}`;
          if (!players[key]) {
            players[key] = { name: ev.assistPlayerName, team: teamName, goals: 0, assists: 0 };
          }
          players[key].assists += 1;
        }
      });
    });

    return Object.values(players).sort(
      (a, b) => b.goals - a.goals || b.assists - a.assists || a.name.localeCompare(b.name)
    );
  }

  function renderSpotlight(tournament, teamMap) {
    const matches = tournament.matches || [];
    let spotlight = matches.find((m) => m.id === activeMatchId);
    if (!spotlight) {
      spotlight =
        matches.find((m) => normalizeStatus(m.status) === 'live') ||
        matches.find((m) => normalizeStatus(m.status) === 'completed') ||
        matches[0];
    }

    const headerMeta = document.getElementById('live-tournament-meta');
    if (headerMeta) {
      const badgeText = tournament.isDemo
        ? 'Interactive Demo Match Center'
        : 'Live Official Tournament Feed';
      headerMeta.innerHTML = `
        <span class="section-tag" style="margin-bottom: 10px;">${escapeHtml(badgeText)}</span>
        <h1 class="live-title">${escapeHtml(tournament.name || 'Turfy Live Tournament')}</h1>
        <p class="live-subtitle">${(tournament.teams || []).length} Teams · ${matches.length} Matches · Powered by Turfy</p>
      `;
    }

    const box = document.getElementById('live-spotlight-box');
    if (!box) return;

    if (!spotlight) {
      box.innerHTML = `<p style="text-align:center; color: var(--text-muted); padding: 24px 0;">Matches have not been scheduled in this tournament yet.</p>`;
      return;
    }

    activeMatchId = spotlight.id;
    const teamA = (teamMap[spotlight.teamAId] && teamMap[spotlight.teamAId].name) || (spotlight.teamAId === 'TBD' ? 'TBD' : 'Team A');
    const teamB = (teamMap[spotlight.teamBId] && teamMap[spotlight.teamBId].name) || (spotlight.teamBId === 'TBD' ? 'TBD' : 'Team B');
    const st = normalizeStatus(spotlight.status);
    const statusLabel = st === 'live' ? 'LIVE NOW' : st === 'completed' ? 'FULL TIME' : 'UPCOMING';
    const statusClass = st === 'live' ? 'badge-live' : st === 'completed' ? 'badge-ft' : 'badge-up';

    const eventsHtml = (spotlight.events || []).length
      ? (spotlight.events || [])
          .map((ev) => {
            const type = String(ev.type || '').toLowerCase();
            const side = ev.teamId === spotlight.teamAId ? teamA : teamB;
            const icon = type.includes('yellow')
              ? '🟨'
              : type.includes('red')
              ? '🟥'
              : type.includes('sub')
              ? '🔄'
              : '⚽';
            const min = ev.minute ? `${escapeHtml(ev.minute)}'` : '';
            const assist = ev.assistPlayerName ? ` <span class="ev-assist">(Assist: ${escapeHtml(ev.assistPlayerName)})</span>` : '';
            return `
              <div class="live-event-row">
                <span class="ev-min">${min}</span>
                <span class="ev-icon">${icon}</span>
                <span class="ev-text"><strong>${escapeHtml(ev.playerName || 'Player')}</strong>${assist} · <span class="ev-team">${escapeHtml(side)}</span></span>
              </div>
            `;
          })
          .join('')
      : '<div style="color: var(--text-dim); font-size: 0.9rem; text-align: center; padding: 10px 0;">No match events recorded yet.</div>';

    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(
      `${teamA} ${spotlight.teamAScore ?? 0} - ${spotlight.teamBScore ?? 0} ${teamB} (${spotlight.round || 'Match'}) — Watch live score & standings on Turfy: ${shareUrl}`
    );

    box.innerHTML = `
      <div class="live-sb-top">
        <span class="live-status-badge ${statusClass}">
          ${st === 'live' ? '<span class="pulse-dot"></span>' : ''} ${statusLabel}
        </span>
        <span class="live-round-label">${escapeHtml(spotlight.round || 'Matchday')}</span>
      </div>

      <div class="live-sb-scoregrid">
        <div class="live-sb-team">
          <div class="live-team-crest">${escapeHtml(teamA.slice(0, 2).toUpperCase())}</div>
          <div class="live-team-name">${escapeHtml(teamA)}</div>
        </div>

        <div class="live-sb-score">
          <span>${Number(spotlight.teamAScore || 0)}</span>
          <span class="live-sb-sep">:</span>
          <span>${Number(spotlight.teamBScore || 0)}</span>
        </div>

        <div class="live-sb-team">
          <div class="live-team-crest">${escapeHtml(teamB.slice(0, 2).toUpperCase())}</div>
          <div class="live-team-name">${escapeHtml(teamB)}</div>
        </div>
      </div>

      <div class="live-events-list">${eventsHtml}</div>

      <div class="live-sb-actions">
        <a href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener noreferrer" class="btn btn-lime btn-sm">
          Share Live Score on WhatsApp
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.turfy.matchscorer&amp;referrer=utm_source=live_viewer%26utm_medium=spotlight"
          target="_blank" rel="noopener noreferrer" onclick="trackDownload('live_spotlight')" class="btn btn-ghost btn-sm">
          Open in Turfy App
        </a>
      </div>
    `;
  }

  function renderTabsContent(tournament, teamMap) {
    const matches = tournament.matches || [];
    const standings = computeStandings(tournament);
    const scorers = computeTopScorers(tournament);

    // 1. Matches panel
    const matchesEl = document.getElementById('live-panel-matches');
    if (matchesEl) {
      if (!matches.length) {
        matchesEl.innerHTML = '<p class="live-empty">No fixtures created yet.</p>';
      } else {
        matchesEl.innerHTML = matches
          .map((m) => {
            const tA = (teamMap[m.teamAId] && teamMap[m.teamAId].name) || 'TBD';
            const tB = (teamMap[m.teamBId] && teamMap[m.teamBId].name) || 'TBD';
            const st = normalizeStatus(m.status);
            const activeCls = m.id === activeMatchId ? ' active' : '';
            const badge = st === 'live' ? 'LIVE' : st === 'completed' ? 'FT' : 'SOON';
            const badgeCls = st === 'live' ? 'badge-live' : st === 'completed' ? 'badge-ft' : 'badge-up';
            return `
              <button type="button" class="live-match-card${activeCls}" data-match-id="${escapeHtml(m.id)}">
                <div class="lmc-top">
                  <span>${escapeHtml(m.round || 'Match')}</span>
                  <span class="live-status-badge ${badgeCls}">${badge}</span>
                </div>
                <div class="lmc-teams">
                  <span class="lmc-name">${escapeHtml(tA)}</span>
                  <span class="lmc-score">${st === 'scheduled' ? 'vs' : `${Number(m.teamAScore || 0)} - ${Number(m.teamBScore || 0)}`}</span>
                  <span class="lmc-name right">${escapeHtml(tB)}</span>
                </div>
              </button>
            `;
          })
          .join('');

        matchesEl.querySelectorAll('.live-match-card').forEach((card) => {
          card.addEventListener('click', () => {
            activeMatchId = card.getAttribute('data-match-id');
            renderAll();
            window.scrollTo({ top: 90, behavior: 'smooth' });
          });
        });
      }
    }

    // 2. Standings panel
    const standingsEl = document.getElementById('live-panel-standings');
    if (standingsEl) {
      if (!standings.length) {
        standingsEl.innerHTML = '<p class="live-empty">Standings will appear once teams join.</p>';
      } else {
        standingsEl.innerHTML = `
          <div class="live-table-wrap">
            <table class="live-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                ${standings
                  .map(
                    (row, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td class="team-cell">${escapeHtml(row.name)}</td>
                    <td>${row.p}</td>
                    <td>${row.w}</td>
                    <td>${row.d}</td>
                    <td>${row.l}</td>
                    <td>${row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                    <td class="pts-cell">${row.pts}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    // 3. Knockout Bracket panel
    const bracketEl = document.getElementById('live-panel-bracket');
    if (bracketEl) {
      const koMatches = matches.filter((m) => isKnockoutRound(m.round));
      if (!koMatches.length) {
        bracketEl.innerHTML =
          '<p class="live-empty">Knockout bracket matches appear automatically once group play concludes.</p>';
      } else {
        bracketEl.innerHTML = `<div class="live-bracket-grid">${koMatches
          .map((m) => {
            const tA = (teamMap[m.teamAId] && teamMap[m.teamAId].name) || 'TBD';
            const tB = (teamMap[m.teamBId] && teamMap[m.teamBId].name) || 'TBD';
            const st = normalizeStatus(m.status);
            return `
              <div class="bracket-card">
                <div class="bracket-round">${escapeHtml(m.round)}</div>
                <div class="bracket-row"><span>${escapeHtml(tA)}</span><strong>${st === 'scheduled' ? '–' : Number(m.teamAScore || 0)}</strong></div>
                <div class="bracket-row"><span>${escapeHtml(tB)}</span><strong>${st === 'scheduled' ? '–' : Number(m.teamBScore || 0)}</strong></div>
              </div>
            `;
          })
          .join('')}</div>`;
      }
    }

    // 4. Top Scorers panel
    const scorersEl = document.getElementById('live-panel-scorers');
    if (scorersEl) {
      if (!scorers.length) {
        scorersEl.innerHTML = '<p class="live-empty">Goal scorers and assists will appear once match events are logged.</p>';
      } else {
        scorersEl.innerHTML = `
          <div class="live-table-wrap">
            <table class="live-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Goals</th>
                  <th>Assists</th>
                </tr>
              </thead>
              <tbody>
                ${scorers
                  .map(
                    (p, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td class="team-cell">${escapeHtml(p.name)}</td>
                    <td>${escapeHtml(p.team)}</td>
                    <td class="pts-cell">${p.goals}</td>
                    <td>${p.assists}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }
  }

  function renderAll() {
    const teamMap = getTeamMap(activeTournament);
    renderSpotlight(activeTournament, teamMap);
    renderTabsContent(activeTournament, teamMap);
  }

  async function fetchTournamentById(id) {
    const statusNote = document.getElementById('live-lookup-status');
    try {
      const res = await fetch(`${FIRESTORE_BASE}/tournaments/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const doc = await res.json();
      const parsed = parseFirestoreDoc(doc);
      if (parsed && parsed.name) {
        activeTournament = parsed;
        activeMatchId = null;
        renderAll();
        if (statusNote) {
          statusNote.textContent = `Connected live to "${parsed.name}" (auto-refreshes every 15s).`;
        }
        return true;
      }
    } catch (_) {
      if (statusNote) {
        statusNote.textContent = `Could not load public tournament "${id}". Showing interactive preview instead.`;
      }
    }
    return false;
  }

  async function fetchRecentPublicTournaments() {
    const chipContainer = document.getElementById('live-recent-chips');
    if (!chipContainer) return;
    try {
      const res = await fetch(`${FIRESTORE_BASE}/tournaments?pageSize=6`);
      if (!res.ok) return;
      const data = await res.json();
      const docs = (data.documents || [])
        .map(parseFirestoreDoc)
        .filter((t) => t && t.name && t.isPublic !== false);

      if (!docs.length) return;

      docs.slice(0, 4).forEach((t) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'live-chip-btn';
        btn.textContent = t.name;
        btn.addEventListener('click', () => {
          const url = new URL(window.location.href);
          url.searchParams.set('id', t.id);
          window.history.replaceState(null, '', url.toString());
          activeTournament = t;
          activeMatchId = null;
          renderAll();
        });
        chipContainer.appendChild(btn);
      });
    } catch (_) {}
  }

  function setupTabs() {
    const btns = document.querySelectorAll('[data-live-tab]');
    const panels = document.querySelectorAll('.live-panel');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-live-tab');
        btns.forEach((b) => {
          const isMatch = b === btn;
          b.classList.toggle('active', isMatch);
          b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });
        panels.forEach((p) => {
          p.classList.toggle('active', p.id === `live-panel-${target}`);
        });
      });
    });
  }

  function setupLookupForm() {
    const form = document.getElementById('live-lookup-form');
    const input = document.getElementById('live-id-input');
    const demoBtn = document.getElementById('live-demo-btn');

    if (form && input) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) return;
        const url = new URL(window.location.href);
        url.searchParams.set('id', val);
        window.history.replaceState(null, '', url.toString());
        await fetchTournamentById(val);
      });
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('id');
        url.searchParams.delete('tournament');
        window.history.replaceState(null, '', url.toString());
        activeTournament = DEMO_TOURNAMENT;
        activeMatchId = null;
        renderAll();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    setupTabs();
    setupLookupForm();
    renderAll();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || params.get('tournament');
    if (id) {
      const input = document.getElementById('live-id-input');
      if (input) input.value = id;
      const ok = await fetchTournamentById(id);
      if (ok) {
        pollTimer = setInterval(() => fetchTournamentById(id), 15000);
      }
    } else {
      fetchRecentPublicTournaments();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (pollTimer) clearInterval(pollTimer);
  });
})();
